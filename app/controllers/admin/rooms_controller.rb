class Admin::RoomsController < Admin::AdminController
  
  before_filter :load_room, :except => [:index, :new, :create]
  
  def index
    @rooms = Room.all
  end
  
  def new
    @room = Room.new
  end
  
  def create
    @room = Room.new(params[:room])

    if @room.save
      redirect_to([:builder, :admin, @room], :notice => 'Room was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def rename_room
    @room.name = params[:name]
    @room.save!
    
    render :inline => "{success : true}"
  end
  
  def builder
    
  end
  
  def place_object
    #check does this object already exist
    if params[:room_object_id]
      @room_object = RoomObject.find(params[:room_object_id])
      set_grid_position @room_object, params[:grid_square_id]
    else
      @room_object = RoomObject.new_from_permid(params[:room_object_permid])
      @room_object.room_id = @room.id
      
      set_grid_position @room_object, params[:grid_square_id]
      
      #need to save here to generate an id
      @room_object.save!
      
      #is this a new table?
      if @room_object.object_type == RoomObject::TABLE
        @table_info = TableInfo.new({:room_object_id => @room_object.id, :perm_id => "Table #{@room_object.id}"})
        @table_info.save!
      end
    end
  end
  
  def update_grid_resolution
    @room.grid_resolution =  params[:grid_resolution]
    @room.save!
    
    render :inline => "{success : true}"
  end
  
  def dimension_change
    if params[:new_x]
      @room.grid_x_size = params[:new_x]
    else
      @room.grid_y_size = params[:new_y]
    end
    
    @room.save!
  end
  
  def label_table
    @room_object = RoomObject.find(params[:room_object_id])
    @table_info = @room_object.table_info
    
    @table_info.perm_id = params[:new_name]
    @table_info.save!
    
    render :inline => "{success : true}"
  end
  
  def remove_table
    RoomObject.find(params[:room_object_id]).destroy
    render :inline => "{success : true}"
  end
  
  private
  
  def load_room
    @room = Room.find(params[:id])
  end
  
  def set_grid_position room_object, position_string
    @grid_parts = position_string.split("_")
    
    room_object.grid_x = @grid_parts.first
    room_object.grid_y = @grid_parts.last
  end

end
