require 'test_helper'

class OrderTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: orders
#
#  id                    :integer(4)      not null, primary key
#  employee_id           :integer(4)
#  total                 :float
#  payment_type          :string(255)
#  amount_tendered       :integer(4)
#  is_table_order        :boolean(1)      default(FALSE)
#  num_persons           :integer(4)
#  created_at            :datetime
#  updated_at            :datetime
#  table_info_id         :integer(4)
#  discount_percent      :float
#  pre_discount_price    :float
#  terminal_id           :string(255)
#  table_info_label      :string(255)
#  tax_chargable         :boolean(1)      default(FALSE)
#  global_sales_tax_rate :float
#  service_charge        :float
#  cashback              :float
#  void_order_id         :integer(4)
#  is_void               :boolean(1)      default(FALSE)
#

