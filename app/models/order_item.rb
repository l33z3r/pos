# == Schema Information
# Schema version: 20110510063013
#
# Table name: order_items
#
#  id             :integer(4)      not null, primary key
#  order_id       :integer(4)
#  employee_id    :integer(4)
#  product_id     :integer(4)
#  quantity       :integer(4)
#  total_price    :float
#  created_at     :datetime
#  updated_at     :datetime
#  modifier_name  :string(255)
#  modifier_price :integer(4)
#

class OrderItem < ActiveRecord::Base
  belongs_to :order
  belongs_to :employee
  belongs_to :product
end
