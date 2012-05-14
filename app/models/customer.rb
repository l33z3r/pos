class Customer < ActiveRecord::Base
  belongs_to :loyalty_level
  has_many :customer_points
  
  validates :loyalty_level_id, :presence => true
end

# == Schema Information
#
# Table name: customers
#
#  id               :integer(4)      not null, primary key
#  name             :string(255)
#  contact_name     :string(255)
#  address          :string(255)
#  postal_address   :string(255)
#  telephone        :string(255)
#  mobile           :string(255)
#  fax              :string(255)
#  email            :string(255)
#  credit_limit     :float
#  current_balance  :float
#  credit_available :float
#  loyalty_level_id :integer(4)
#  available_points :integer(4)
#  swipe_card_code  :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

