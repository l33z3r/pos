class Admin::ProductsController < Admin::AdminController
  def index
    @products = Product.paginate :page => params[:page], :order => 'name'
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @product = Product.new
  end

  def edit
    @product = Product.find(params[:id])
  end

  def create
    @product = Product.new(params[:product])

    if @product.save
      redirect_to(admin_products_url, :notice => 'Product was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @product = Product.find(params[:id])

    if params[:delete_product_image]
      @product.product_image.destroy #Will remove the attachment and save the model
      @product.product_image.clear #Will queue the attachment to be deleted
    end
    
    if @product.update_attributes(params[:product])
      redirect_to(admin_products_url, :notice => 'Product was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def update_price
    @product = Product.find(params[:id])
    @product.price = params[:price]
    @product.save!
    
    render :json => {:success => true}.to_json
  end

  def destroy
    @product = Product.find(params[:id])
    @product.destroy

    redirect_to(admin_products_url, :notice => 'Product was successfully deleted.')
  end
end
