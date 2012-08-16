require 'test_helper'

class TerminalSyncDataTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end



# == Schema Information
#
# Table name: terminal_sync_data
#
#  id         :integer(4)      not null, primary key
#  sync_type  :integer(4)
#  time       :string(255)
#  data       :text(2147483647
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(4)
#

