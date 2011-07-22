require 'test_helper'

class ProductTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: products
#
#  id                         :integer(4)      not null, primary key
#  brand                      :string(255)
#  name                       :string(255)
#  category_id                :integer(4)
#  description                :string(255)
#  size                       :float
#  unit                       :string(255)
#  items_per_unit             :integer(4)
#  sales_tax_rate             :float
#  price                      :float
#  created_at                 :datetime
#  updated_at                 :datetime
#  product_image_file_name    :string(255)
#  product_image_content_type :string(255)
#  product_image_file_size    :integer(4)
#  product_image_updated_at   :datetime
#  modifier_category_id       :integer(4)
#  tax_rate_id                :integer(4)
#

