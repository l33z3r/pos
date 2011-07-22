require 'test_helper'

class OrderItemTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: order_items
#
#  id                 :integer(4)      not null, primary key
#  order_id           :integer(4)
#  employee_id        :integer(4)
#  product_id         :integer(4)
#  quantity           :integer(4)
#  total_price        :float
#  created_at         :datetime
#  updated_at         :datetime
#  modifier_name      :string(255)
#  modifier_price     :float
#  discount_percent   :float
#  pre_discount_price :float
#  tax_rate           :float
#  terminal_id        :string(255)
#  time_added         :string(255)
#

