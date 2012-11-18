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
#  id                                       :integer(8)      not null, primary key
#  name                                     :string(255)
#  parent_category_id                       :integer(8)
#  description                              :string(255)
#  created_at                               :datetime
#  updated_at                               :datetime
#  tax_rate_id                              :integer(8)
#  printers                                 :string(255)     default("")
#  order_item_addition_grid_id              :integer(8)
#  order_item_addition_grid_id_is_mandatory :boolean(1)      default(FALSE)
#  course_num                               :integer(4)      default(-1)
#  kitchen_screens                          :string(255)     default("")
#  blocked_printers                         :string(255)
#  prompt_for_covers                        :boolean(1)      default(FALSE)
#  outlet_id                                :integer(8)
#

