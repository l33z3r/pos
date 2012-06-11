class Admin::CustomersController < Admin::AdminController
  
  def index
    @show_loyalty_customers = params[:show_loyalty_customers]
    @show_normal_customers = params[:show_normal_customers]
    
    #ensure only one filter is selected
    if !@show_loyalty_customers and !@show_normal_customers
      @show_normal_customers = true
    elsif @show_loyalty_customers and @show_normal_customers
      @show_loyalty_customers = false
    end
    
    @selected_letter = "all"
    @customers = Customer.all
      
    query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from customers group by substr(name,1,1)")
    @letters = []
    
    for element in query
      if (!"0123456789".include?(element[0]))
        element[0].upcase!
        @letters += element
      end
    end
  end  
  
  #code to import customers from csv
#    require 'csv'
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
    @customer.loyalty_level_id = LoyaltyLevel.load_default.id
  end

  def edit
    @hide_admin_header = true
    @customer = Customer.find(params[:id])
  end

  def create
    @customer = Customer.new(params[:customer])

    if @customer.save
      redirect_to(admin_customers_url, :notice => 'Customer was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @customer = Customer.find(params[:id])

    if @customer.update_attributes(params[:customer])
      redirect_to(admin_customers_url, :notice => 'Customer was successfully updated.')
    else
      @hide_admin_header = true
      render :action => "edit"
    end
  end

  def search
    @search = Customer.search(params[:search]).order('name') 
    @customers = @search.all
  end

end
