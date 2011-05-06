module Admin::AdminHelper
  
  def preview_graphic_for_room_object room_object
    image_tag room_object.preview_graphic_for
  end
  
  def graphic_for_room_object room_object
    return if !room_object
    image_tag room_object.graphic_for
  end
  
end
