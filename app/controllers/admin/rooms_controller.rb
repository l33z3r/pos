class Admin::RoomsController < Admin::AdminController
  
  before_filter :load_room, :except => [:index, :new, :create, :tables]
  
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
    
    render :json => {:success => true}.to_json
  end
  
  def builder
    
  end
  
  def place_object
    #check does this object already exist and we are simply moving it on the grid
    @place_error = false
    
    @grid_parts = params[:grid_square_id].split("_")
    
    @grid_x = @grid_parts.first.to_i
    @grid_y = @grid_parts.last.to_i
    
    if params[:room_object_id]
      @room_object = RoomObject.find(params[:room_object_id])
      
      if check_intersection(@room, @grid_x, @grid_y, @room_object.permid, @room_object.id)
        @room_object.grid_x = @grid_x
        @room_object.grid_y = @grid_y
        @room_object.save!
      else
        @place_error = true
      end
    else
      @room_object = RoomObject.new_from_permid(params[:room_object_permid])
      @room_object.room_id = @room.id
      
      if check_intersection(@room, @grid_x, @grid_y, @room_object.permid, nil)
        @room_object.grid_x = @grid_x
        @room_object.grid_y = @grid_y
        
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
    
    render :json => {:success => true}.to_json
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
    
    render :json => {:success => true}.to_json
  end
  
  def remove_table
    @room_object_id = params[:room_object_id]
    
    @room_object = RoomObject.find(@room_object_id)
    
    @table_id = @room_object.table_info.id
    
    @room_object.destroy
    
    #remove the sync info for that table
    TerminalSyncData.remove_sync_data_for_table @table_id
    
    render :json => {:success => true}.to_json
  end
  
  def remove_wall
    RoomObject.find(params[:wall_id]).destroy
    render :json => {:success => true}.to_json
  end
  
  def destroy
    @room = Room.find(params[:id])
    @room.destroy

    redirect_to(admin_rooms_url, :notice => 'Room was deleted.')
  end
  
  private
  
  def load_room
    @room = Room.find(params[:id])
  end
  
  def check_intersection room, target_x, target_y, permid, existing_room_object_id
    #check that this position is not already occupied
    @existing_object = false
    
    @temp_room_object = RoomObject.new_from_permid(permid)
    @temp_room_object.grid_x = target_x
    @temp_room_object.grid_y = target_y
    
    @new_room_object_coords = @temp_room_object.coords
    
    room.room_objects.each do |room_object|
      next if existing_room_object_id == room_object.id
      
      @intersecting_coords = room_object.coords & @new_room_object_coords
      logger.info "Coords1: #{room_object.coords} Coords2: #{@new_room_object_coords} Inter: #{@intersecting_coords}"
      if @intersecting_coords.length > 0
        @existing_object = true
        break;
      end
    end
    
    return !@existing_object
  end

end
