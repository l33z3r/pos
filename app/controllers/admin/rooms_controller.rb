class Admin::RoomsController < Admin::AdminController
  
  before_filter :load_room, :only => [:builder, :label_table, :place_table, :place_wall, :place_object]
  
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
  
  def builder
    
  end
  
  def label_table
    
  end
  
  def place_object
    @new_room_object = RoomObject.new_from_permid(params[:room_object_permid])
    @grid_parts = params[:grid_square_id].split("_")
    @new_room_object.grid_x = @grid_parts.first
    @new_room_object.grid_y = @grid_parts.last
    
    @new_room_object.room_id = @room.id
    
    @new_room_object.save!
  end
  
  private
  
  def load_room
    @room = Room.find(params[:id])
  end

end
