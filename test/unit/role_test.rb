require 'test_helper'

class RoleTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: roles
#
#  id            :integer(4)      not null, primary key
#  name          :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  pin_required  :boolean(1)      default(FALSE)
#  login_allowed :boolean(1)      default(TRUE)
#

