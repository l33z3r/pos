class Admin::DisplaysController < Admin::AdminController
  cache_sweeper :display_sweeper
  
  def index
    @displays = current_outlet.displays.all
  end

  def new
    @disp = Display.new
  end

  def create
    @display = Display.new(params[:display])

    @display.outlet_id = current_outlet.id
    
    if @display.save!
      #give the display an initial 2 pages
      @page_1 = @display.menu_pages.build({:outlet_id => current_outlet.id, :name => "Favourites", :page_num => 1})
      @page_2 = @display.menu_pages.build({:outlet_id => current_outlet.id, :name => "Page 2", :page_num => 2})

      @page_1.save!
      @page_2.save!

      (1..16).each do |num|
        @page_1.menu_items.build({:outlet_id => current_outlet.id, :order_num => num}).save!
        @page_2.menu_items.build({:outlet_id => current_outlet.id, :order_num => num}).save!
      end
      
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
      redirect_to(builder_admin_display_path(@display), :notice => 'Display was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @display = current_outlet.displays.find(params[:id])

    if @display.update_attributes(params[:display])
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
      flash[:notice] = 'Display was successfully updated.'
      redirect_to :action => "index"
    else
      flash[:error] = 'Error updating display'
      render :action => "index"
    end
  end
  
  def duplicate
    @display_to_dup = current_outlet.displays.find(params[:id])
    @new_display = Display.new({:outlet_id => current_outlet.id, :name => "#{@display_to_dup.name} (Copied: #{Time.zone.now.to_s(:short)})"})
    
    @new_display.save!
    
    @display_to_dup.menu_pages.each do |mp|
      @new_page = @new_display.menu_pages.build({:outlet_id => current_outlet.id, :name => mp.name, :page_num => mp.page_num})
      @new_page.save!
      
      if mp.embedded_display
        @new_page.embedded_display_id = mp.embedded_display_id
        @new_page.save!
      else
        mp.menu_items.each do |mi|
          @new_menu_item = @new_page.menu_items.build({:outlet_id => current_outlet.id, :product_id => mi.product_id, :order_num => mi.order_num})
          @new_menu_item.save!
        end
      end
    end
    
    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    redirect_to(admin_displays_path, :notice => 'Display was successfully duplicated.')
  end

  def destroy
    #Don't allow deleting of last one
    if current_outlet.displays.all.size == 1
      flash[:notice] = "You must have at least one display"
      redirect_to admin_displays_url
      return
    end
    
    @display = current_outlet.displays.find(params[:id])
    @display.destroy

    #force load default in case it was destroyed
    Display.load_default(current_outlet)
    
    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    redirect_to(admin_displays_url, :notice => 'Display was deleted.')
  end

  def rename_display
    @display = current_outlet.displays.find(params[:id])
    
    @display.name = params[:name]
    @display.save!
    
    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    render :json => {:success => true}.to_json
  end
  
  #where the building gets done (mostly via ajax)
  #try to use as much ajax as possible here
  def builder
    @display = current_outlet.displays.find(params[:id])
    @displays = current_outlet.displays.all
  end

  #when a product is dragged to a square
  def place_product
    @product = current_outlet.products.find_by_id(params[:product_id])

    @menu_item_id = params[:menu_item_id]

    @display = current_outlet.displays.find(params[:id])
    
    if @menu_item_id == "-1"
      @menu_page_num = params[:menu_page_num]
      @menu_page = @display.menu_pages.find_by_page_num @menu_page_num
      
      if(!@menu_page.menu_items.last) 
        @next_order_num = 1
      else
        @next_order_num = @menu_page.menu_items.last.order_num + 1
      end

      @menu_item = MenuItem.create({:outlet_id => current_outlet.id, :menu_page_id => @menu_page.id, :order_num => @next_order_num})
      
      if @product
        #we are replacing
        @menu_item.product_id = @product.id 
        @menu_item.save
      end
      
    else
      @menu_item = current_outlet.menu_items.find(@menu_item_id)
      
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
        
        @new_menu_item = MenuItem.create({:outlet_id => current_outlet.id, :menu_page_id => @menu_item.menu_page_id, :order_num => @order_num})
      end
    end
    
    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    @menu_item.save!
  end

  #a menu_item is removed from the grid
  #must redraw the whole grid
  def delete_menu_item
    @menu_item = current_outlet.menu_items.find(params[:menu_item_id])

    MenuItem.delete_menu_item @menu_item

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    render :json => {:success => true}.to_json
  end

  def create_menu_page
    @display = current_outlet.displays.find(params[:id])

    if @display.menu_pages.count > 0
      @next_page_num = @display.menu_pages.last.page_num + 1
    else 
      @next_page_num = 1
    end
    
    @new_page = @display.menu_pages.build({:outlet_id => current_outlet.id, :name => "Page #{@next_page_num}", :page_num => @next_page_num})
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
      @embedded_display = current_outlet.displays.find(@embedded_display_id)
      
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
        @new_page.menu_items.build({:outlet_id => current_outlet.id, :order_num => num}).save!
      end
    end
    
    #save again after build
    @new_page.save!
    
    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    flash[:notice] = "Page Created"
    redirect_to builder_admin_display_path(@display)
  end

  def delete_menu_page
    @display = current_outlet.displays.find(params[:id])

    @menu_page = @display.menu_pages.find(params[:menu_page_id])

    #shift the order number down on all following menu pages
    @menu_pages_to_shift = @display.menu_pages.where("page_num > #{@menu_page.page_num}")
    
    @menu_pages_to_shift.each do |mp|
      mp.page_num -=1
      mp.save
    end
    
    @menu_page.destroy

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    redirect_to(builder_admin_display_path(@display), :notice => 'Page Deleted.')
  end

  def rename_menu_page
    @display = current_outlet.displays.find(params[:id])

    @menu_page = @display.menu_pages.find(params[:menu_page_id])

    @menu_page.name = params[:new_name]
    @menu_page.save!

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    render :json => {:success => true}.to_json
  end
  
  def rename_menu_item
    @display = current_outlet.displays.find(params[:id])

    @menu_item = @display.menu_items.find(params[:menu_item_id])

    @menu_item.product.name = params[:new_name]
    @menu_item.product.save!

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    render :json => {:success => true}.to_json
  end

  def default
    @old_default_display = Display.load_default(current_outlet)
    @old_default_display.is_default = false
    @old_default_display.save

    @new_default_display = current_outlet.displays.find(params[:id])
    @new_default_display.is_default = true
    @new_default_display.save

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
    render :json => {:success => true}.to_json
  end
  
  def public
    @old_public_display = Display.load_public(current_outlet)
    @old_public_display.is_public = false
    @old_public_display.save

    @new_public_display = current_outlet.displays.find(params[:id])
    @new_public_display.is_public = true
    @new_public_display.save

    render :json => {:success => true}.to_json
  end

end
