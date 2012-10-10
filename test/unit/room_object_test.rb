require 'test_helper'

class RoomObjectTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end



# == Schema Information
#
# Table name: room_objects
#
#  id          :integer(8)      not null, primary key
#  object_type :string(255)
#  permid      :string(255)
#  label       :string(255)
#  room_id     :integer(8)
#  grid_x      :integer(4)
#  grid_y      :integer(4)
#  grid_x_size :integer(4)
#  grid_y_size :integer(4)
#  created_at  :datetime
#  updated_at  :datetime
#  outlet_id   :integer(8)
#

