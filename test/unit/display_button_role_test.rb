require 'test_helper'

class DisplayButtonRoleTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: display_button_roles
#
#  id                   :integer(4)      not null, primary key
#  display_button_id    :integer(4)
#  role_id              :integer(4)
#  show_on_sales_screen :boolean(1)      default(FALSE)
#  show_on_admin_screen :boolean(1)      default(FALSE)
#  created_at           :datetime
#  updated_at           :datetime
#  passcode_required    :boolean(1)      default(FALSE)
#  outlet_id            :integer(4)
#

