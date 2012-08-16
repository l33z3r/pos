require 'test_helper'

class CashTotalTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: cash_totals
#
#  id                  :integer(4)      not null, primary key
#  total_type          :string(255)
#  total               :float
#  start_calc_order_id :integer(4)
#  end_calc_order_id   :integer(4)
#  created_at          :datetime
#  updated_at          :datetime
#  employee_id         :integer(4)
#  terminal_id         :string(255)
#  report_num          :integer(4)
#  report_data         :text
#  outlet_id           :integer(4)
#

