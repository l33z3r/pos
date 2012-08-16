class RoomObject < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :room
  has_one :table_info, :dependent => :destroy
  
  validates :room_id, :presence => true
  
  TABLE = "table"
  WALL = "wall"
  VALID_OBJECT_TYPES = [TABLE, WALL]
  
  validates :object_type, :presence => true, :inclusion => { :in => VALID_OBJECT_TYPES }
  
  validates :permid, :presence => true
  validates :label, :presence => true
  validates :grid_x, :presence => true, :numericality => true
  validates :grid_y, :presence => true, :numericality => true
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  
  def self.available_objects
    @wall_1_1_v = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_v", :label => "1x1 Wall V"})
    @wall_1_1_h = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_h", :label => "1x1 Wall H"})
    
    @wall_1_1_lt = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_lt", :label => "1x1 Wall CLT"})
    @wall_1_1_lb = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_lb", :label => "1x1 Wall CLB"})
    @wall_1_1_rt = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_rt", :label => "1x1 Wall CRT"})
    @wall_1_1_rb = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_rb", :label => "1x1 Wall CRB"})
    
    @wall_1_1_tt = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_ttop", :label => "1x1 Wall TT"})
    @wall_1_1_tr = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_tright", :label => "1x1 Wall TR"})
    @wall_1_1_tb = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_tbottom", :label => "1x1 Wall TB"})
    @wall_1_1_tl = RoomObject.new({:object_type => WALL, :grid_x_size => 1, :grid_y_size => 1, :permid => "wall_1_1_tleft", :label => "1x1 Wall TL"})
    
    @available_walls = [@wall_1_1_v, @wall_1_1_h, @wall_1_1_lt, @wall_1_1_lb, 
      @wall_1_1_rt, @wall_1_1_rb, @wall_1_1_tt, @wall_1_1_tr, @wall_1_1_tb, @wall_1_1_tl]
    
    @table_2_2_s = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_s", :label => "2x2 Table S"})
    @table_2_2_d = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_d", :label => "2x2 Table D"})
    @table_2_2_h = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_h", :label => "2x2 Table H"})
    @table_2_2_v = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_v", :label => "2x2 Table V"})
    
    @table_2_1 = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 1, :permid => "table_2_1", :label => "2x1 Table"})
    @table_1_2 = RoomObject.new({:object_type => TABLE, :grid_x_size => 1, :grid_y_size => 2, :permid => "table_1_2", :label => "1x2 Table"})
    
    @table_2_2_r6 = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_r6", :label => "2x1 Table R6"})
    @table_2_2_r8 = RoomObject.new({:object_type => TABLE, :grid_x_size => 2, :grid_y_size => 2, :permid => "table_2_2_r8", :label => "2x1 Table R8"})
    
    @tab1 = RoomObject.new({:object_type => TABLE, :grid_x_size => 1, :grid_y_size => 1, :permid => "table_1_1", :label => "Tab"})
    
    @available_tables = [@table_2_2_s, @table_2_2_d, @table_2_2_h, @table_2_2_v, 
      @table_2_1, @table_1_2, @table_2_2_r6, @table_2_2_r8, @tab1]
    
    @available_objects = @available_tables | @available_walls
    
    @available_objects
  end
  
  def self.new_from_permid permid, current_outlet
    @parts = permid.split("_")
    @object_type = @parts.first
    @grid_x_size = @parts.second
    @grid_y_size = @parts.third
    
    @new_room_object = RoomObject.new({:outlet_id => current_outlet.id, :object_type => @object_type, :grid_x_size => @grid_x_size, 
        :grid_y_size => @grid_y_size, :permid => permid, :label => permid})
    
    @new_room_object
  end
  
  def graphic_for
    #map the permid to the name of an image
    @image_path = "room_builder/#{permid}.png"
  end
  
  def preview_graphic_for
    return "room_builder/#{permid}_preview.png"
  end
  
  def coords
    @coords = []
    
    (grid_x..(grid_x + grid_x_size - 1)).each do |xval|
      (grid_y..(grid_y + grid_y_size - 1)).each do |yval|
        @coords << [xval, yval]
      end
    end
    
    @coords
  end
  
end

# == Schema Information
#
# Table name: room_objects
#
#  id          :integer(4)      not null, primary key
#  object_type :string(255)
#  permid      :string(255)
#  label       :string(255)
#  room_id     :integer(4)
#  grid_x      :integer(4)
#  grid_y      :integer(4)
#  grid_x_size :integer(4)
#  grid_y_size :integer(4)
#  created_at  :datetime
#  updated_at  :datetime
#  outlet_id   :integer(4)
#

