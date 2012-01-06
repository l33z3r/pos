class OrderItemAdditionGrid < ActiveRecord::Base
  has_many :order_item_additions, :dependent => :destroy
  
  validates :name, :presence => true, :uniqueness => true
  validates :grid_x_size, :presence => true, :numericality => true
  validates :grid_y_size, :presence => true, :numericality => true
  
  def dimension
    "#{grid_x_size}x#{grid_y_size}"
  end
  
  def item_for_position(x, y)
    order_item_additions.where("pos_x = ?", x).where("pos_y = ?", y).first
  end
  
  def self.load_default
    order_item_addition_grid = find_by_is_default(true)
    
    if !order_item_addition_grid
      order_item_addition_grid = find(:first)
      
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
#

