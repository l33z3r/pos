class CustomerPoints < ActiveRecord::Base
  belongs_to :customer
  belongs_to :order
  
  validates :loyalty_level_percent, :presence => true, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}
end
