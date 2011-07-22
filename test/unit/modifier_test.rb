require 'test_helper'

class ModifierTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: modifiers
#
#  id                   :integer(4)      not null, primary key
#  modifier_category_id :integer(4)
#  name                 :string(255)
#  price                :float
#  created_at           :datetime
#  updated_at           :datetime
#

