class RoomObject < ActiveRecord::Base
  belongs_to :room
  
  validates :room_id, :presence => true
  
  TABLE = "table"
  WALL = "wall"
  VALID_OBJECT_TYPES = [TABLE, WALL]
  
  validates :object_type, :presence => true, :inclusion => { :in => VALID_OBJECT_TYPES }
  
  validates :permid, :presence => true, :uniqueness => true
  validates :label, :presence => true
  validates :grid_x, :presence => true, :numericality => true
  validates :grid_y, :presence => true, :numericality => true
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  
  def self.available_objects
    @wall_3_1 = RoomObject.new({:object_type => WALL, :grid_x_size => 3, :grid_y_size => 1, :permid => "wall_3_1", :label => "3x1 Wall"})
    @wall_2_1 = RoomObject.new({:object_type => WALL, :grid_x_size => 2, :grid_y_size => 1, :permid => "wall_2_1", :label => "2x1 Wall"})
    @wall_1_3 = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 3, :permid => "wall_1_3", :label => "1x3 Wall"})
    @wall_1_2 = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 2, :permid => "wall_1_2", :label => "1x2 Wall"})
    
    @available_walls = [@wall_3_1, @wall_2_1, @wall_1_3, @wall_1_2]
    
    @table_2_1 = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 1, :permid => "table_2_1", :label => "2x1 Table"})
    @table_1_2 = RoomObject.new({:object_type => TABLE, :grid_x_size => 1, :grid_y_size => 2, :permid => "table_1_2", :label => "1x2 Table"})
    @table_2_2 = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2", :label => "2x2 Table"})
    
    @available_tables = [@table_2_1, @table_1_2, @table_2_2]
    
    @available_objects = @available_walls | @available_tables
    
    @available_objects
  end
  
  def self.new_from_permid permid
    @parts = permid.split("_")
    @object_type = @parts.first
    @grid_x_size = @parts.second
    @grid_y_size = @parts.last
    
    @new_room_object = RoomObject.new({:object_type => @object_type, :grid_x_size => @grid_x_size, 
        :grid_y_size => @grid_y_size, :permid => permid, :label => permid})
    
    @new_room_object
  end
  
end