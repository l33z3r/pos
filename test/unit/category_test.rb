require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: categories
#
#  id                 :integer(4)      not null, primary key
#  name               :string(255)
#  parent_category_id :integer(4)
#  description        :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#  tax_rate_id        :integer(4)
#

