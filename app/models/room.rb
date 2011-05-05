class Room < ActiveRecord::Base
  has_many :room_objects
  
  validates :name, :presence => true, :uniqueness => true
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  
end
