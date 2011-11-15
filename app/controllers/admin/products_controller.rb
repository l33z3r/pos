class Admin::ProductsController < Admin::AdminController
  cache_sweeper :product_sweeper
  
  def index
    @selected_letter = "all"
    @products = Product.where("is_deleted = ?", false).order("name")
    query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from products group by substr(name,1,1)")
    @letters = []
    for element in query
      if(!"0123456789".include?(element[0]))
        @letters += element
      end
    end
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @hide_admin_header = true
    @product = Product.new
  end

  def edit
    @hide_admin_header = true
    @product = Product.find(params[:id])
  end

  def create
    @product = Product.new(params[:product])

    @new_menu_1_id = params[:product][:menu_page_1_id]
    @old_menu_1_id = @product.menu_page_1 ? @product.menu_page_1.id : nil
    @new_menu_2_id = params[:product][:menu_page_2_id]
    @old_menu_2_id = @product.menu_page_2 ? @product.menu_page_2.id : nil
    
    if @product.save
      update_menus_for_product @product, @new_menu_1_id, @old_menu_1_id, @new_menu_2_id, @old_menu_2_id
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
    
    @new_menu_1_id = params[:product][:menu_page_1_id]
    @old_menu_1_id = @product.menu_page_1 ? @product.menu_page_1.id : nil
    @new_menu_2_id = params[:product][:menu_page_2_id]
    @old_menu_2_id = @product.menu_page_2 ? @product.menu_page_2.id : nil
    
    if @product.update_attributes(params[:product])
      
      update_menus_for_product @product, @new_menu_1_id, @old_menu_1_id, @new_menu_2_id, @old_menu_2_id
      
      #we may have came to this page directly from the menu builder screen
      #we want to store the fact, so that when we update the product, we go back to that screen 
      if !params[:back_builder_screen_id].blank?
        @display = Display.find(params[:back_builder_screen_id])
        redirect_to(builder_admin_display_path(@display), :notice => 'Product was successfully updated.')
      else
        redirect_to(admin_products_url, :notice => 'Product was successfully updated.')
      end
    else
      @hide_admin_header = true
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

  def search
    @search1 = Product.search(params[:search1]).order('name')
    @products1 = @search1.all
    if(!params[:search2].nil? && !params[:search3].nil?)
        @search2 = Product.where("(code_num = ? OR upc = ? OR price = ? OR price_2 = ? OR price_3 = ? OR price_4) AND is_deleted = false", params[:search2], params[:search2], params[:search2], params[:search2], params[:search2]).order('name')
        @search3 = Product.search(params[:search3]).order('name')
        @products2 = @search2.all
        @products3 = @search3.all
        @merge1 = @products2 | @products3
        @intersection = @merge1 & @products1  
        @products = @intersection.sort! { |a, b|  a.name <=> b.name }
    else
        @products = @products1.sort! { |a, b|  a.name <=> b.name }
    end
    
  end

  def mark_as_deleted
    @product = Product.find(params[:id])
    @product.is_deleted = true
    @product.save!
    #remove the product from all menu_pages deleting menu_items
    @product.menu_items.each do |menu_item|
      MenuItem.delete_menu_item(menu_item)
    end
  end

  private 
  
  def update_menus_for_product product, new_menu_1_id, old_menu_1_id, new_menu_2_id, old_menu_2_id
    update_menu_for_product product, new_menu_1_id, old_menu_1_id
    update_menu_for_product product, new_menu_2_id, old_menu_2_id
  end
  
  def update_menu_for_product product, new_menu_id, old_menu_id
    
    return if new_menu_id == old_menu_id
    
    #remove it from old_menu_id
    if !old_menu_id.blank?
      @old_menu_page = MenuPage.find(old_menu_id)
      
      @old_menu_page.menu_items.each do |mi|
        next if !mi.product
        
        if mi.product.id == product.id
          MenuItem.delete_menu_item mi
          break
        end
      end
    end
    
    #add it to new_menu_id if it's not already there
    if !new_menu_id.blank?    
      @new_menu_page = MenuPage.find(new_menu_id)
      
      @new_menu_page.menu_items.each do |mi|
        next if !mi.product
        
        if mi.product.id == product.id
          return
        end
      end
    
      if(!@new_menu_page.menu_items.last) 
        @next_order_num = 1
      else
        @next_order_num = @new_menu_page.menu_items.last.order_num + 1
      end
      
      @menu_item = MenuItem.create({:product_id => product.id, 
          :menu_page_id => new_menu_id, :order_num => @next_order_num})
    end
    
  end

end
