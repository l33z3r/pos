require 'test_helper'

class StoredReceiptHtmlTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: stored_receipt_htmls
#
#  id           :integer(4)      not null, primary key
#  receipt_type :string(255)
#  receipt_key  :string(255)
#  stored_html  :text
#  created_at   :datetime
#  updated_at   :datetime
#

