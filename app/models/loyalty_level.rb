class LoyaltyLevel < ActiveRecord::Base
  validates :name, :presence => true
  validates :percent, :presence => true, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}
  
  has_many :customers
  
  def self.load_default
    loyalty_level = find_by_is_default(true)
    
    if !loyalty_level
      loyalty_level = find(:first)
      loyalty_level.is_default = true
      loyalty_level.save
    end

    loyalty_level
  end
end
