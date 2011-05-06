class Room < ActiveRecord::Base
  has_many :room_objects
  
  validates :name, :presence => true, :uniqueness => true
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  validates :grid_resolution, :presence => true, :numericality => true
  
  def permid_for_grid_square(x, y)
    @room_object = room_object_for_grid_square(x, y)
    
    if @room_object
      return @room_object.permid
    else 
      return nil
    end
  end
  
  def room_object_for_grid_square(x, y)
    room_objects.find(:first, :conditions => "grid_x = #{x} and grid_y = #{y}")
  end
  
  def dimension
    "#{grid_x_size}x#{grid_y_size}"
  end
end
