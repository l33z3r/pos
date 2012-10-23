class Admin::RoomsController < Admin::AdminController
  cache_sweeper :room_sweeper
  before_filter :load_room, :except => [:index, :new, :create, :tables]
  
  def index
    @rooms = current_outlet.rooms.all
  end
  
  def new
    @room = Room.new
  end
  
  def create
    @room = Room.new(params[:room])

    @room.outlet_id = current_outlet.id
    
    if @room.save
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to([:builder, :admin, @room], :notice => 'Room was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def rename_room
    @room.name = params[:name]
    @room.save!
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
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
      @room_object = current_outlet.room_objects.find(params[:room_object_id])
      
      if check_intersection(@room, @grid_x, @grid_y, @room_object.permid, @room_object.id)
        @room_object.grid_x = @grid_x
        @room_object.grid_y = @grid_y
        @room_object.save!
      else
        @place_error = true
      end
    else
      @room_object = RoomObject.new_from_permid(params[:room_object_permid], current_outlet)
      @room_object.outlet_id = current_outlet.id
      @room_object.room_id = @room.id
      
      if check_intersection(@room, @grid_x, @grid_y, @room_object.permid, nil)
        @room_object.grid_x = @grid_x
        @room_object.grid_y = @grid_y
        
        #send a reload request to other terminals
        request_sales_resources_reload @terminal_id
    
        #need to save here to generate an id
        @room_object.save!
      
        #is this a new table?
        if @room_object.object_type == RoomObject::TABLE
          @table_info = TableInfo.new({:outlet_id => current_outlet.id, :room_object_id => @room_object.id, :perm_id => "#{@room_object.id}"})
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
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    render :json => {:success => true}.to_json
  end
  
  def dimension_change
    if params[:new_x]
      @room.grid_x_size = params[:new_x]
    else
      @room.grid_y_size = params[:new_y]
    end
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    @room.save!
  end
  
  def label_table
    @room_object_id = params[:room_object_id]
    
    @room_object = current_outlet.room_objects.find(@room_object_id)
      
    @table_info = @room_object.table_info
    @table_id = @table_info.id
      
    #TODO: make sure there are no open orders on this table and also that its number is unique
    @rename = true
    
    #make sure this table is closed before we remove it.
    #if there is no sync data, then it is safe,
    #or if the only sync data is a clear table order, then it is safe also
    TerminalSyncData.fetch_sync_table_order_times(current_outlet).each do |tsd|
      if tsd.data[:table_id].to_s == @table_id.to_s
        #there is sync data for this table,
        #if it is not data related to clearing the table, 
        #then this table is still open, so throw a wobller!
        if !tsd.data[:clear_table_order]
          @rename = false
          @message = "Table #{@table_info.perm_id} has an open order at it, please clear it before renaming the table"
        end
      end
    end
    
    if @rename
      #now make sure the name is a unique number
      @new_label = params[:new_name]
    
      #test for a number with a regex
      if !(@new_label =~ /^\d+$/) or @new_label.to_i < 1
        @rename = false
        @message = "New table number must be a positive number"
      end
    end
    
    if @rename
      @existing_table = current_outlet.table_infos.find_by_perm_id(@new_label)
      
      if @existing_table and (@existing_table.id != @table_id)
        @rename = false
        @message = "A table with that number already exists, please choose a unique number"
      end
    end
    
    if @rename
      @table_info.perm_id = @new_label
      @table_info.save!
    end
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
  end
  
  def remove_table
    @room_object_id = params[:room_object_id]
    
    @room_object = current_outlet.room_objects.find(@room_object_id)
    
    @table_info = @room_object.table_info
    @table_id = @table_info.id
    
    @delete = true
    
    #make sure this table is closed before we remove it.
    #if there is no sync data, then it is safe,
    #or if the only sync data is a clear table order, then it is safe also
    TerminalSyncData.fetch_sync_table_order_times(current_outlet).each do |tsd|
      if tsd.data[:table_id].to_s == @table_id.to_s
        #there is sync data for this table,
        #if it is not data related to clearing the table, 
        #then this table is still open, so throw a wobller!
        if !tsd.data[:clear_table_order]
          @delete = false
        end
      end
    end
    
    if @delete
      @room_object.destroy
    
      #remove the sync info for that table
      TerminalSyncData.remove_sync_data_for_table @table_id, current_outlet
    end
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
  end
  
  def remove_wall
    current_outlet.room_objects.find(params[:wall_id]).destroy
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    render :json => {:success => true}.to_json
  end
  
  def update
    @room = current_outlet.rooms.find(params[:id])
    
    @room.update_attributes(params[:room])
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    redirect_to admin_rooms_url
  end
  
  def destroy
    @room = current_outlet.rooms.find(params[:id])
    
    @delete = true
    
    #make sure all tables are closed before we remove the room.
    #if there is no sync data, then it is safe,
    #or if the only sync data is a clear table order, then it is safe also
    @room.table_infos.each do |table_info|
      TerminalSyncData.fetch_sync_table_order_times(current_outlet).each do |tsd|
        if tsd.data[:table_id].to_s == table_info.id.to_s
          #there is sync data for this table,
          #if it is not data related to clearing the table, 
          #then this table is still open, so throw a wobller!
          if !tsd.data[:clear_table_order]
            @delete = false
          end
        end
      end
    end
    
    if @delete
      #remove the sync info for all tables in that room
      @room.table_infos.each do |table_info|
        logger.info("checking delete for table info #{table_info.id}")
        TerminalSyncData.remove_sync_data_for_table table_info.id, current_outlet
      end
    
      @room.destroy
    
      @notice = "Room was deleted."
    else
      @notice = "Please close all tables for this room before you delete it"
    end

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    flash[:notice] = @notice
    redirect_to admin_rooms_url
  end
  
  private
  
  def load_room
    @room = current_outlet.rooms.find(params[:id])
  end
  
  def check_intersection room, target_x, target_y, permid, existing_room_object_id
    #check that this position is not already occupied
    @existing_object = false
    
    @temp_room_object = RoomObject.new_from_permid(permid, current_outlet)
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
