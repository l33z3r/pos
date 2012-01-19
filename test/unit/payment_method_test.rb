require 'test_helper'

class PaymentMethodTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: payment_methods
#
#  id                     :integer(4)      not null, primary key
#  name                   :string(255)
#  is_default             :boolean(1)
#  logo_file_name         :string(255)
#  logo_content_type      :string(255)
#  logo_file_size         :integer(4)
#  logo_updated_at        :datetime
#  created_at             :datetime
#  updated_at             :datetime
#  payment_integration_id :integer(4)      default(0)
#

