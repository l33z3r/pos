require 'test_helper'

class EmployeeTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: employees
#
#  id                          :integer(4)      not null, primary key
#  staff_id                    :string(255)
#  name                        :string(255)
#  nickname                    :string(255)
#  passcode                    :string(255)
#  address                     :string(255)
#  telephone                   :string(255)
#  hourly_rate                 :float
#  overtime_rate               :float
#  last_login                  :datetime        default(2012-01-07 09:28:01 UTC)
#  last_active                 :datetime        default(2012-01-07 09:28:01 UTC)
#  last_logout                 :datetime        default(2012-01-07 09:28:01 UTC)
#  created_at                  :datetime
#  updated_at                  :datetime
#  role_id                     :integer(4)      default(1)
#  employee_image_file_name    :string(255)
#  employee_image_content_type :string(255)
#  employee_image_file_size    :integer(4)
#  employee_image_updated_at   :datetime
#  clockin_code                :string(255)
#

