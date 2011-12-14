require 'test_helper'

class MenuPageTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: menu_pages
#
#  id                  :integer(4)      not null, primary key
#  name                :string(255)
#  display_id          :integer(4)
#  page_num            :integer(4)
#  created_at          :datetime
#  updated_at          :datetime
#  embedded_display_id :integer(4)
#

