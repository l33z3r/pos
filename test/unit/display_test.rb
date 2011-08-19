require 'test_helper'

class DisplayTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: displays
#
#  id                          :integer(4)      not null, primary key
#  name                        :string(255)
#  created_at                  :datetime
#  updated_at                  :datetime
#  is_default                  :boolean(1)      default(FALSE)
#  order_item_addition_grid_id :integer(4)
#

