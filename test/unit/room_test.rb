require 'test_helper'

class RoomTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: rooms
#
#  id              :integer(4)      not null, primary key
#  name            :string(255)
#  grid_x_size     :integer(4)
#  grid_y_size     :integer(4)
#  created_at      :datetime
#  updated_at      :datetime
#  grid_resolution :integer(4)      default(5)
#

