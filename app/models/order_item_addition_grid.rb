class OrderItemAdditionGrid < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :order_item_additions, :dependent => :destroy
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
  
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  
  def dimension
    "#{grid_x_size}x#{grid_y_size}"
  end
  
  def item_for_position(x, y)
    order_item_additions.where("pos_x = ?", x).where("pos_y = ?", y).first
  end
  
  def self.load_default current_outlet
    order_item_addition_grid = find_by_outlet_id_and_is_default(current_outlet.id, true)
    
    if !order_item_addition_grid
      order_item_addition_grid = find_first_by_outlet_id(current_outlet.id)
      
      order_item_addition_grid.is_default = true
      order_item_addition_grid.save
    end

    order_item_addition_grid
  end
  
end




# == Schema Information
#
# Table name: order_item_addition_grids
#
#  id          :integer(4)      not null, primary key
#  name        :string(255)
#  grid_x_size :integer(4)
#  grid_y_size :integer(4)
#  created_at  :datetime
#  updated_at  :datetime
#  outlet_id   :integer(4)
#

