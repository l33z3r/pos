require 'test_helper'

class DisplayButtonTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end



# == Schema Information
#
# Table name: display_buttons
#
#  id                      :integer(8)      not null, primary key
#  button_text             :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#  perm_id                 :integer(4)
#  display_button_group_id :integer(8)
#  outlet_id               :integer(8)
#

