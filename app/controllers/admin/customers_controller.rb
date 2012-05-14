class Admin::CustomersController < Admin::AdminController
  
  def index
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

  def new
    @hide_admin_header = true
    @customer = Customer.new
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
      redirect_to(admin_products_url, :notice => 'Customer was successfully updated.')
    else
      @hide_admin_header = true
      render :action => "edit"
    end
  end

  def search
    #get parameters from request or session
    if (!params[:search1].nil? || !params[:search2].nil? || !params[:search3].nil?)
      @param1 = params[:search1]
      @param2 = params[:search2]
      @param3 = params[:search3]
      save_params(@param1, @param2, @param3)
    else
      @param1 = session[:search1]
      @param2 = session[:search2]
      @param3 = session[:search3]
      get_session_parameters_to_fields
    end
    #search
    @search1 = Product.search(@param1).order('name')
    @products1 = @search1.all
    if (!@param2.nil? && !@param3.nil?)
      @search2 = Product.where("(code_num = ? OR upc = ? OR price = ? OR price_2 = ? OR price_3 = ? OR price_4) AND is_deleted = false", @param2, @param2, @param2, @param2, @param2).order('name')
      @search3 = Product.search(@param3).order('name')
      @products2 = @search2.all
      @products3 = @search3.all
      @merge1 = @products2 | @products3
      @intersection = @merge1 & @products1
      @products = @intersection.sort! { |a, b| a.name <=> b.name }
    else
      @products = @products1.sort! { |a, b| a.name <=> b.name }
    end
  end

end
