class LoyaltyLevel < ActiveRecord::Base
  belongs_to :outlet
  
  validates :label, :presence => true
  validates :percent, :presence => true, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}
  
  has_many :customers
  
  def self.load_default current_outlet
    loyalty_level = find_by_outlet_id_and_is_default(current_outlet.id, true)
    
    if !loyalty_level
      loyalty_level = find_first_by_outlet_id(current_outlet.id)
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
#  percent    :float           default(10.0), not null
#  is_default :boolean(1)      default(FALSE)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(4)
#

