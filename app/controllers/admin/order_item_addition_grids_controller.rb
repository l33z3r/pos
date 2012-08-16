class Admin::OrderItemAdditionGridsController < Admin::AdminController
  cache_sweeper :oia_sweeper
  
  def index
    @oiags = current_outlet.order_item_addition_grids.all
  end
  
  def new
    @oiag = OrderItemAdditionGrid.new
  end
  
  def create
    @oiag = OrderItemAdditionGrid.new(params[:order_item_addition_grid])

    @oiag.outlet_id = current_outlet.id
    
    if @oiag.save
      redirect_to([:builder, :admin, @oiag], :notice => 'Grid was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def builder
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    
    @hide_admin_header = true
  end
  
  def destroy
    #Don't allow deleting of last one
    if current_outlet.order_item_addition_grids.all.size == 1
      flash[:notice] = "You must have at least one modifier grid!"
      redirect_to admin_order_item_addition_grids_url
      return
    end
    
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    @oiag.destroy

    redirect_to(admin_order_item_addition_grids_url, :notice => 'Grid was deleted.')
  end

  def default
    @old_default_order_item_addition_grid = OrderItemAdditionGrid.load_default(current_outlet)
    @old_default_order_item_addition_grid.is_default = false
    @old_default_order_item_addition_grid.save

    @new_default_order_item_addition_grid = current_outlet.order_item_addition_grids.find(params[:id])
    @new_default_order_item_addition_grid.is_default = true
    @new_default_order_item_addition_grid.save

    render :json => {:success => true}.to_json
  end
  
  def resize
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    
    new_width = params[:width].to_i
    new_height = params[:height].to_i
    
    if new_width != 4 and new_width != 6
      new_width = 4
    end
    
    if new_height != 4 and new_height != 6
      new_height = 4
    end
    
    @oiag.grid_x_size = new_width
    @oiag.grid_y_size = new_height
    
    @oiag.save!
  end
  
  def rename
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    @newName = params[:newName]
    
    @oiag.name = @newName
    
    @oiag.save!
    
    render :json => {:success => true}.to_json
  end
  
  def update_item
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    @x = params[:x]
    @y = params[:y]
    
    @item = @oiag.item_for_position(@x, @y)
    
    if !@item
      @item = @oiag.order_item_additions.build({:outlet_id => current_outlet.id, :pos_x => @x, :pos_y => @y})
    end
    
    @item.description = params[:description]
    @item.add_charge = params[:addCharge]
    @item.minus_charge = params[:minusCharge]
    
    @item.available = params[:available]
    @item.background_color = params[:bgColor]
    @item.background_color_2 = params[:bgColor2]
    @item.text_color = params[:textColor]
    @item.text_size = params[:textSize]
    @item.hide_on_receipt = params[:hideOnReceipt]
    @item.is_addable = params[:isAddable]
    
    @item.product_id = params[:productId]
    @item.follow_on_grid_id = params[:followOnGridId]
    
    @item.save!
  end
  
  def delete_item
    @oiag = current_outlet.order_item_addition_grids.find(params[:id])
    @x = params[:x]
    @y = params[:y]
    
    @item = @oiag.item_for_position(@x, @y)
    
    if @item
      @item.destroy
    end
  end
  
  private

end
