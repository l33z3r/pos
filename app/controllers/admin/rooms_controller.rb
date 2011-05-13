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
    #check does this object already exist and we are simply moving it on the grid
    @place_error = false
    
    if params[:room_object_id]
      @room_object = RoomObject.find(params[:room_object_id])
      
      if set_grid_position(@room, @room_object, params[:grid_square_id])
        @room_object.save!
      else
        @place_error = true
      end
    else
      @room_object = RoomObject.new_from_permid(params[:room_object_permid])
      @room_object.room_id = @room.id
      
      if set_grid_position(@room, @room_object, params[:grid_square_id]) 
        #need to save here to generate an id
        @room_object.save!
      
        #is this a new table?
        if @room_object.object_type == RoomObject::TABLE
          @table_info = TableInfo.new({:room_object_id => @room_object.id, :perm_id => "Table #{@room_object.id}"})
          @table_info.save!
        end
      else
        @place_error = true
      end
    end
  end
  
  def update_grid_resolution
    @room.grid_resolution =  params[:grid_resolution]
    @room.save!
    
    render :inline => "{success : true}".to_json
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
  
  def set_grid_position room, room_object, position_string
    @grid_parts = position_string.split("_")
    
    @grid_x = @grid_parts.first.to_i
    @grid_y = @grid_parts.last.to_i
    
    #check that this position is not already occupied
    @existing_object = false
    
    room.room_objects.each do |room_object|
      @room_object
      room_object.coords.each do |x, y|
        logger.info "LOGINFO!!!! Room Object: #{room_object.permid} #{x} #{y} #{@grid_x} #{@grid_y}"
        @x = x
        if x == @grid_x and y == @grid_y
          logger.info "CLLLLLLLLLLASH!"
          @existing_object = true
          break;
        end
      end
    end
    
    return false if @existing_object
    
    room_object.grid_x = @grid_x
    room_object.grid_y = @grid_y
    
    return true
  end

end
