require 'test_helper'

class TaxRateTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: tax_rates
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  rate       :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(4)
#

