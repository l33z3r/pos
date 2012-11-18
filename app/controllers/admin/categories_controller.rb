class Admin::CategoriesController < Admin::AdminController
  def index
    @categories = current_outlet.categories.paginate :page => params[:page], :order => 'name'
  end

  def show
    @category = current_outlet.categories.find(params[:id])
  end

  def new
    @category = Category.new
  end

  def edit
    @category = current_outlet.categories.find(params[:id])
  end

  def create
    @category = Category.new(params[:category])

    @category.outlet_id = current_outlet.id
    
    if @category.save
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to(admin_categories_url, :notice => 'Category was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @category = current_outlet.categories.find(params[:id])

    if @category.update_attributes(params[:category])
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to(admin_categories_url, :notice => 'Category was successfully updated.')
    else
      render :action => "edit"
    end
  end

  def destroy
    @category = current_outlet.categories.find(params[:id])
    @category.destroy

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    redirect_to(admin_categories_url, :notice => 'Category was successfully deleted.')
  end
end
