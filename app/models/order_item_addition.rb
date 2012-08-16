class OrderItemAddition < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :order_item_addition_grid
  belongs_to :follow_on_grid, :class_name => "OrderItemAdditionGrid"
  belongs_to :product
    
  validates :order_item_addition_grid_id, :presence => true, :numericality => true
  
  validates :description, :presence => true
  validates :add_charge, :presence => true, :numericality => true
  validates :minus_charge, :presence => true, :numericality => true
  validates :text_size, :numericality => true, :allow_blank => true
  validates :pos_x, :presence => true, :numericality => true
  validates :pos_y, :presence => true, :numericality => true

end





# == Schema Information
#
# Table name: order_item_additions
#
#  id                          :integer(4)      not null, primary key
#  order_item_addition_grid_id :integer(4)
#  description                 :string(255)
#  add_charge                  :float
#  minus_charge                :float
#  available                   :boolean(1)      default(TRUE)
#  background_color            :string(255)
#  text_color                  :string(255)
#  text_size                   :integer(4)
#  pos_x                       :integer(4)
#  pos_y                       :integer(4)
#  created_at                  :datetime
#  updated_at                  :datetime
#  background_color_2          :string(255)
#  hide_on_receipt             :boolean(1)      default(TRUE)
#  is_addable                  :boolean(1)      default(FALSE)
#  follow_on_grid_id           :integer(4)
#  product_id                  :integer(4)
#  outlet_id                   :integer(4)
#

