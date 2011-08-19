class Admin::OrderItemAdditionGridsController < Admin::AdminController
  
  def index
    @oiags = OrderItemAdditionGrid.all
  end
  
  def new
    @oiag = OrderItemAdditionGrid.new
  end
  
  def create
    @oiag = OrderItemAdditionGrid.new(params[:order_item_addition_grid])

    if @oiag.save
      redirect_to([:builder, :admin, @oiag], :notice => 'Grid was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def builder
    @oiag = OrderItemAdditionGrid.find(params[:id])
    
    @hide_admin_header = true
  end
  
  def destroy
    @oiag = OrderItemAdditionGrid.find(params[:id])
    @oiag.destroy

    redirect_to(admin_order_item_addition_grids_url, :notice => 'Grid was deleted.')
  end

  def default
    @old_default_order_item_addition_grid = OrderItemAdditionGrid.load_default
    @old_default_order_item_addition_grid.is_default = false
    @old_default_order_item_addition_grid.save

    @new_default_order_item_addition_grid = OrderItemAdditionGrid.find(params[:id])
    @new_default_order_item_addition_grid.is_default = true
    @new_default_order_item_addition_grid.save

    render :json => {:success => true}.to_json
  end
  
  def resize
    @oiag = OrderItemAdditionGrid.find(params[:id])
    new_width = params[:width]
    new_height = params[:height]
    
    @oiag.grid_x_size = new_width
    @oiag.grid_y_size = new_height
    
    @oiag.save!
  end
  
  def update_item
    @oiag = OrderItemAdditionGrid.find(params[:id])
    @x = params[:x]
    @y = params[:y]
    
    @item = @oiag.item_for_position(@x, @y)
    
    if !@item
      @item = @oiag.order_item_additions.build({:pos_x => @x, :pos_y => @y})
    end
    
    @item.description = params[:description]
    @item.add_charge = params[:addCharge]
    @item.minus_charge = params[:minusCharge]
    
    @item.available = params[:available]
    @item.background_color = params[:bgColor]
    @item.text_color = params[:textColor]
    @item.text_size = params[:textSize]
    
    @item.save!
  end
  
  private

end
