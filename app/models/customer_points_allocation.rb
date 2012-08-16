class CustomerPointsAllocation < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :customer
  belongs_to :order
  
  SALE_EARN = 1
  SALE_REDUCE = 2
  MANUAL_EARN = 3
  MANUAL_REDUCE = 4
  
  VALID_ALLOCATION_TYPES = [SALE_EARN, SALE_REDUCE, MANUAL_EARN, MANUAL_REDUCE]
  
  validates :loyalty_level_percent, :presence => true, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}
  validates :allocation_type, :numericality => true, :inclusion => { :in => VALID_ALLOCATION_TYPES }
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
#  allocation_type       :integer(4)
#  outlet_id             :integer(4)
#

