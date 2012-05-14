class Customer < ActiveRecord::Base
  belongs_to :loyalty_level
  has_many :customer_points
  
end
