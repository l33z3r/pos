class Outlet < ActiveRecord::Base
  belongs_to :cluey_account
end

# == Schema Information
#
# Table name: outlets
#
#  id               :integer(4)      not null, primary key
#  cluey_account_id :integer(4)
#  name             :string(255)
#  username         :string(255)
#  password         :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

