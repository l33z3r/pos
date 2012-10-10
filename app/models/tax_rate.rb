class TaxRate < ActiveRecord::Base
  belongs_to :outlet
  
  validates :name, :presence => true
  validates :rate, :presence => true, :numericality => true
  
  has_many :categories, :dependent => :nullify
  has_many :products, :dependent => :nullify
  
  def name_for_select
    "#{name} (#{rate}%)"  
  end
  
  def self.load_default current_outlet
    tax_rate = find_by_outlet_id_and_is_default(current_outlet.id, true)
    
    if !tax_rate
      tax_rate = find_first_by_outlet_id(current_outlet.id)
      tax_rate.is_default = true
      tax_rate.save
    end

    tax_rate
  end
  
end


# == Schema Information
#
# Table name: tax_rates
#
#  id         :integer(8)      not null, primary key
#  name       :string(255)
#  rate       :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(8)
#

