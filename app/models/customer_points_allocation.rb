class CustomerPointsAllocation < ActiveRecord::Base
  belongs_to :customer
  belongs_to :order
  
  validates :loyalty_level_percent, :presence => true, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}
end

# == Schema Information
#
# Table name: customer_points_allocations
#
#  id                    :integer(4)      not null, primary key
#  customer_id           :integer(4)
#  order_id              :integer(4)
#  amount                :integer(4)
#  loyalty_level_percent :float
#  created_at            :datetime
#  updated_at            :datetime
#

