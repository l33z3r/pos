require 'test_helper'

class MenuItemTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: menu_items
#
#  id           :integer(4)      not null, primary key
#  menu_page_id :integer(4)
#  product_id   :integer(4)
#  created_at   :datetime
#  updated_at   :datetime
#  order_num    :integer(4)      default(0)
#  outlet_id    :integer(4)
#

