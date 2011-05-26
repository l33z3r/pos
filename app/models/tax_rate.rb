# == Schema Information
# Schema version: 20110526094125
#
# Table name: tax_rates
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  rate       :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#

class TaxRate < ActiveRecord::Base
  validates :name, :presence => true
  validates :rate, :presence => true, :numericality => true
  
  has_many :categories
  has_many :products
  
  def name_for_select
    "#{name} (#{rate}%)"  
  end
  
  def self.load_default
    tax_rate = find_by_is_default(true)
    
    if !tax_rate
      tax_rate = find(:first)
    end

    tax_rate
  end
  
end
