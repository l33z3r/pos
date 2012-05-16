class Customer < ActiveRecord::Base
  belongs_to :loyalty_level
  has_many :customer_points
  
  validates :name, :presence => true
  validates :contact_name, :presence => true
  
  def is_loyalty_customer?
    !loyalty_level_id.blank? and !swipe_card_code.blank?
  end
end



# == Schema Information
#
# Table name: customers
#
#  id               :integer(4)      not null, primary key
#  name             :string(255)
#  contact_name     :string(255)
#  dob              :date
#  address          :string(255)
#  postal_address   :string(255)
#  telephone        :string(255)
#  mobile           :string(255)
#  fax              :string(255)
#  email            :string(255)
#  credit_limit     :float           default(0.0), not null
#  current_balance  :float           default(0.0), not null
#  credit_available :float           default(0.0), not null
#  loyalty_level_id :integer(4)
#  available_points :integer(4)      default(0), not null
#  swipe_card_code  :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

