module Admin::AdminHelper
  
  def preview_graphic_for_room_object room_object
    image_tag room_object.preview_graphic_for
  end
  
  def graphic_for_room_object room_object
    return if !room_object
    image_tag room_object.graphic_for
  end
  
  def markup_for_room_object room_object
    if room_object.object_type == RoomObject::WALL
      render "table_grid_square", :wall => room_object
    elsif room_object.object_type == RoomObject::TABLE
      render "table_grid_square", :table => room_object    
    end
  end
  
end
