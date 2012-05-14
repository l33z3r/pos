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

# == Schema Information
#
# Table name: loyalty_levels
#
#  id         :integer(4)      not null, primary key
#  label      :string(255)
#  percent    :float
#  is_default :boolean(1)      default(FALSE)
#  created_at :datetime
#  updated_at :datetime
#

