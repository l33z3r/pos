require 'test_helper'

class GlobalSettingTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end




# == Schema Information
#
# Table name: global_settings
#
#  id                :integer(8)      not null, primary key
#  key               :string(255)
#  value             :text
#  label_text        :string(255)
#  logo_file_name    :string(255)
#  logo_content_type :string(255)
#  logo_file_size    :integer(4)
#  logo_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#  outlet_id         :integer(8)
#

