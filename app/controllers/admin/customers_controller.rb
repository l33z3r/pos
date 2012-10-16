class Admin::CustomersController < Admin::AdminController
  
  def index
    respond_to do |format|
      
      format.html do
        @show_loyalty_customers = params[:show_loyalty_customers]
        @show_normal_customers = params[:show_normal_customers]
    
        #ensure only one filter is selected
        if !@show_loyalty_customers and !@show_normal_customers
          @show_normal_customers = true
        elsif @show_loyalty_customers and @show_normal_customers
          @show_loyalty_customers = false
        end
    
        @selected_letter = "all"
        @customers = Customer.all_active(current_outlet)
      
        query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from customers where outlet_id = #{current_outlet.id} group by substr(name,1,1)")
        @letters = []
    
        for element in query
          if (!"0123456789".include?(element[0]))
            element[0].upcase!
            @letters += element
          end
        end
      end
      
      format.csv do 
        @customers = Customer.all_active(current_outlet)

        @csv_string = "Customer Number,Customer Type,Name,Contact Name, DOB,Address,Postal Address,Telephone,Mobile,Fax,"
        @csv_string += "Email,Credit Limit,Current Balance,Credit Available,Loyalty Level,Available Loyalty Points,Swipe Card Code\n"
        
        @customers.each do |c|
          @customer_type = Customer::CUSTOMER_TYPE_LABELS[c.customer_type]
          
          @address = c.address.gsub(",", "").gsub("\r", "").gsub("\n", "")
          @postal_address = c.postal_address.gsub(",", "").gsub("\r", "").gsub("\n", "")
          
          @dob = c.dob ? c.dob.strftime(GlobalSetting.default_date_format) : ""
          
          @credit_limit = print_money(c.credit_limit).gsub(",", "")
          @current_balance = print_money(c.current_balance).gsub(",", "")
          @credit_available = print_money(c.credit_available).gsub(",", "")
          
          @loyalty_level = c.loyalty_level.label
            
          @csv_string += "#{c.customer_number},#{@customer_type},#{c.name},#{c.contact_name},#{@dob},#{@address},#{@postal_address},"
          @csv_string += "#{c.telephone},#{c.mobile},#{c.fax},#{c.email},#{@credit_limit},#{@current_balance},#{@credit_available},"
          @csv_string += "#{@loyalty_level},#{c.available_points},#{c.swipe_card_code}\n"
        end
        
        render :text => @csv_string
      end
      
    end
  end  
  
  #code to import customers from csv
  #    if params[:gen]
  #      @resp = ""
  #      
  #      @row_count = 0
  #      
  #      CSV.foreach('/home/lee/Downloads/customers.csv') do |row|
  #        @row_count += 1
  #        next if @row_count == 1
  #        
  #        #logger.info row
  #        @name = row[1]
  #        #logger.info "!!!!!!!!!!!!!!!!!!!looking up name #{@name}"
  #        @customer = Customer.find_by_name @name
  #      
  #        @resp += @customer.name
  #      
  #        @new_dob = row[7]
  #        
  #        if !@new_dob.blank?
  #          logger.info "!!!!!!!!!!!Changing DOB for #{@customer.name} from #{@customer.dob} to #{@new_dob}"
  #          @new_date = Date.strptime(@new_dob, '%m-%d-%Y')
  #          logger.info "Parsed: #{@new_date}"
  #          @customer.dob = @new_date
  #          @customer.save
  #        end
  #        
  #        #        @contact_name = @name
  #        #        @dob = row[7]
  #        #        @address = "#{row[2]}, #{row[3]}, #{row[4]}, #{row[5]}, #{row[6]}"
  #        #        @postal_address = @address
  #        #        @telephone = row[8]
  #        #        @mobile = @telephone
  #        #        @email = row[10]
  #        #        @available_points = row[12]
  #        #        @swipe_card_code = row[11]
  #        #           
  #        #        @customer = Customer.new({
  #        #            :name => @name, :contact_name => @contact_name, :customer_type => "loyalty",
  #        #            :dob => @dob, :address => @address, :postal_address => @postal_address,
  #        #            :telephone => @telephone, :mobile => @mobile, :email => @email,
  #        #            :available_points => @available_points, :swipe_card_code => @swipe_card_code
  #        #          })
  #        #        
  #        #        if !@customer.valid?
  #        #          logger.info "!!!!!!!!!!!!!!!!!!!!!!!!Valid #{@customer.name} #{@customer.errors}"
  #        #        else 
  #        #          @customer.save
  #        #        end
  #      end
  #      render :text => "Done #{@resp}"
  #      return
  #    end

  def new
    @hide_admin_header = true
    @customer = Customer.new
    @customer.loyalty_level_id = LoyaltyLevel.load_default(current_outlet).id
  end

  def edit
    @hide_admin_header = true
    #    @customer = current_outlet.cluey_account.customers.readonly(false).find(params[:id])
    @customer = current_outlet.customers.find(params[:id])
  end

  def create
    @customer = Customer.new(params[:customer])

    @customer.outlet_id = current_outlet.id
    
    if @customer.save
      redirect_to(admin_customers_url, :notice => 'Customer was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    #    @customer = current_outlet.cluey_account.customers.readonly(false).find(params[:id])
    @customer = current_outlet.customers.find(params[:id])

    @old_loyalty_points_amount = @customer.available_points
    
    if @customer.update_attributes(params[:customer])
      @new_loyalty_points_amount = @customer.available_points
    
      if @old_loyalty_points_amount != @new_loyalty_points_amount
        #create an allocation
        @points_change_amount = @new_loyalty_points_amount - @old_loyalty_points_amount
        @allocation_type = @points_change_amount > 0 ? CustomerPointsAllocation::MANUAL_EARN : CustomerPointsAllocation::MANUAL_REDUCE
        
        CustomerPointsAllocation.create({:outlet_id => current_outlet.id, :customer_id => @customer.id, :allocation_type => @allocation_type, 
            :amount => @points_change_amount, :loyalty_level_percent => @customer.loyalty_level.percent})
      end
    
      redirect_to(admin_customers_url, :notice => 'Customer was successfully updated.')
    else
      @hide_admin_header = true
      render :action => "edit"
    end
  end

  def search
    #    @search = current_outlet.cluey_account.customers.readonly(false).search(params[:search]).order('name') 
    @search = current_outlet.customers.search(params[:search]).order('name') 
    @customers = @search.all
  end

end
