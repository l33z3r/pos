class Admin::DisplaysController < Admin::AdminController
  cache_sweeper :display_sweeper
  
  def index
    @displays = Display.all
  end

  def new
    @disp = Display.new
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
      
      #grab the default modifier grid
      @display.order_item_addition_grid
      
      redirect_to(builder_admin_display_path(@display), :notice => 'Display was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @display = Display.find(params[:id])

    if @display.update_attributes(params[:display])
      flash[:notice] = 'Display was successfully updated.'
      redirect_to :action => "index"
    else
      flash[:error] = 'Error updating display'
      render :action => "index"
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

    #force load default in case it was destroyed
    Display.load_default
    
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
    @displays = Display.all
  end

  #when a product is dragged to a square
  def place_product
    @product = Product.find_by_id(params[:product_id])

    @menu_item_id = params[:menu_item_id]

    @display = Display.find(params[:id])
    
    if @menu_item_id == "-1"
      @menu_page_num = params[:menu_page_num]
      @menu_page = @display.menu_pages.find_by_page_num @menu_page_num
      
      if(!@menu_page.menu_items.last) 
        @next_order_num = 1
      else
        @next_order_num = @menu_page.menu_items.last.order_num + 1
      end

      @menu_item = MenuItem.create({:menu_page_id => @menu_page.id, :order_num => @next_order_num})
      
      if @product
        #we are replacing
        @menu_item.product_id = @product.id 
        @menu_item.save
      end
      
    else
      @menu_item = MenuItem.find(@menu_item_id)
      
      if @product
        #we are replacing
        @menu_item.product_id = @product.id 
      else
        #we are inserting before
        @order_num = @menu_item.order_num
        
        #renumber the following menu items
        #shift the order number down on all following menu items
        @menu_items_to_shift = @menu_item.menu_page.menu_items.where("order_num >= #{@order_num}")
    
        @menu_items_to_shift.each do |mi|
          mi.order_num +=1
          mi.save
        end
        
        @new_menu_item = MenuItem.create({:menu_page_id => @menu_item.menu_page_id, :order_num => @order_num})
      end
    end
    
    @menu_item.save!
  end

  #a menu_item is removed from the grid
  #must redraw the whole grid
  def delete_menu_item
    @menu_item = MenuItem.find(params[:menu_item_id])

    MenuItem.delete_menu_item @menu_item

    render :json => {:success => true}.to_json
  end

  def create_menu_page
    @display = Display.find(params[:id])

    @next_page_num = @display.menu_pages.last.page_num + 1
    
    @new_page = @display.menu_pages.build({:name => "Page #{@next_page_num}", :page_num => @next_page_num})
    @new_page.save!
    
    @embedded_display_id = params[:embedded_display_id]
    
    if @embedded_display_id
      
      #same display?
      if @embedded_display_id == @display.id.to_s
        @new_page.destroy
        flash[:error] = "You cannot embed a display within itself."
        redirect_to builder_admin_display_path(@display)
        return
      end
      
      #make sure that this display has no nested one
      @embedded_display = Display.find(@embedded_display_id)
      
      if @embedded_display.has_nested
        @new_page.destroy
        flash[:error] = "You cannot nest a display here, as this display contains a nested display."
        redirect_to builder_admin_display_path(@display)
        return
      else
        @new_page.embedded_display_id = @embedded_display_id
        @new_page.name = @embedded_display.name
      end
    else
      (1..16).each do |num|
        @new_page.menu_items.build({:order_num => num}).save!
      end
    end
    
    #save again after build
    @new_page.save!
    flash[:notice] = "Page Created"
    redirect_to builder_admin_display_path(@display)
  end

  def delete_menu_page
    @display = Display.find(params[:id])

    @menu_page = @display.menu_pages.find(params[:menu_page_id])

    #shift the order number down on all following menu pages
    @menu_pages_to_shift = @display.menu_pages.where("page_num > #{@menu_page.page_num}")
    
    @menu_pages_to_shift.each do |mp|
      mp.page_num -=1
      mp.save
    end
    
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
