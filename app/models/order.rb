# == Schema Information
# Schema version: 20110531092627
#
# Table name: orders
#
#  id               :integer(4)      not null, primary key
#  employee_id      :integer(4)
#  total            :float
#  payment_type     :string(255)
#  amount_tendered  :integer(4)
#  is_table_order   :boolean(1)
#  num_persons      :integer(4)
#  created_at       :datetime
#  updated_at       :datetime
#  table_info_id    :integer(4)
#  discount_percent :float
#

class Order < ActiveRecord::Base
  has_many :order_items
  belongs_to :employee
  belongs_to :table_info
end
