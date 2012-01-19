require 'test_helper'

class DiscountTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: discounts
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  percent    :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#

