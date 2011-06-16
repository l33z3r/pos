class Admin::DisplaysController < Admin::AdminController

  def index
    @displays = Display.all
  end

  def new
    @display = Display.new
  end

  def create
    @display = Display.new(params[:display])

    if @display.save!
      #give the display an initial 2 pages
      @page_1 = @display.menu_pages.build({:name => "Favourites", :page_num => 1})
      @page_2 = @display.menu_pages.build({:name => "Page 2", :page_num => 2})

      @page_1.save!
      @page_2.save!

      (1..16).each do |num|
        @page_1.menu_items.build({:order_num => num}).save!
        @page_2.menu_items.build({:order_num => num}).save!
      end
    
      redirect_to(builder_admin_display_path(@display), :notice => 'Display was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def duplicate
    @display_to_dup = Display.find(params[:id])
    @new_display = Display.new({:name => "#{@display_to_dup.name} (#{Time.now.to_s(:short)})"})
    
    @new_display.save!
    
    @display_to_dup.menu_pages.each do |mp|
      @new_page = @new_display.menu_pages.build({:name => mp.name, :page_num => mp.page_num})
      @new_page.save!
      
      mp.menu_items.each do |mi|
        @new_menu_item = @new_page.menu_items.build({:product_id => mi.product_id, :order_num => mi.order_num})
        @new_menu_item.save!
      end
    end
    
    redirect_to(admin_displays_path, :notice => 'Display was successfully duplicated.')
  end

  def destroy
    @display = Display.find(params[:id])
    @display.destroy

    redirect_to(admin_displays_url, :notice => 'Display was deleted.')
  end

  def rename_display
    @display = Display.find(params[:id])
    
    @display.name = params[:name]
    @display.save!
    
    render :json => {:success => true}.to_json
  end
  
  #where the building gets done (mostly via ajax)
  #try to use as much ajax as possible here
  def builder
    @display = Display.find(params[:id])
  end

  #when a product is dragged to a square
  def place_product
    @product = Product.find(params[:product_id])

    @menu_item_id = params[:menu_item_id]

    if @menu_item_id == "-1"
      @menu_page_num = params[:menu_page_num]
      @menu_page = Display.load_default.menu_pages.find_by_page_num @menu_page_num
      
      if(!@menu_page.menu_items.last) 
        @next_order_num = 1
      else
        @next_order_num = @menu_page.menu_items.last.order_num + 1
      end

      @menu_item = MenuItem.create({:menu_page_id => @menu_page.id, :order_num => @next_order_num})
    else
      @menu_item = MenuItem.find(params[:menu_item_id])
    end

    @menu_item.product_id = @product.id
    @menu_item.save!
  end

  #a menu_item is removed from the grid
  #must redraw the whole grid
  def delete_menu_item
    @menu_item = MenuItem.find(params[:menu_item_id])

    #shift the order number down on all following menu items
    @menu_items_to_shift = @menu_item.menu_page.menu_items.find(:all, :conditions => "order_num > #{@menu_item.order_num}")
    
    @menu_items_to_shift.each do |mi|
      mi.order_num -=1
      mi.save
    end

    @menu_item.destroy

    render :json => {:success => true}.to_json
  end

  def create_menu_page
    @display = Display.find(params[:id])

    @next_page_num = @display.menu_pages.last.page_num + 1
    @new_page = @display.menu_pages.build({:name => "Page #{@next_page_num}", :page_num => @next_page_num})
    @new_page.save!

    (1..16).each do |num|
      @new_page.menu_items.build({:order_num => num}).save!
    end

    redirect_to(builder_admin_display_path(@display), :notice => 'New Page Added.')
  end

  def delete_menu_page
    @display = Display.find(params[:id])

    @menu_page = @display.menu_pages.find(params[:menu_page_id])

    @menu_page.destroy

    redirect_to(builder_admin_display_path(@display), :notice => 'Page Deleted.')
  end

  def rename_menu_page
    @display = Display.find(params[:id])

    @menu_page = @display.menu_pages.find(params[:menu_page_id])

    @menu_page.name = params[:new_name]
    @menu_page.save!

    render :json => {:success => true}.to_json
  end
  
  def rename_menu_item
    @display = Display.find(params[:id])

    @menu_item = @display.menu_items.find(params[:menu_item_id])

    @menu_item.product.name = params[:new_name]
    @menu_item.product.save!

    render :json => {:success => true}.to_json
  end

  def default
    @old_default_display = Display.load_default
    @old_default_display.is_default = false
    @old_default_display.save

    @new_default_display = Display.find(params[:id])
    @new_default_display.is_default = true
    @new_default_display.save

    render :json => {:success => true}.to_json
  end

end
