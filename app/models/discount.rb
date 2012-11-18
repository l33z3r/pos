class Discount < ActiveRecord::Base
  belongs_to :outlet
  
  validates :name, :presence => true
  validates :percent, :presence => true, :numericality => true
  
  has_many :orders
  has_many :order_items
  
  def name_for_select
    "#{name} (#{percent}%)"  
  end
  
  def self.load_default current_outlet
    discount = find_by_outlet_id_and_is_default(current_outlet.id, true)
    
    if !discount
      discount = find_first_by_outlet_id(current_outlet.id)
      
      discount.is_default = true
      discount.save
    end

    discount
  end
end


# == Schema Information
#
# Table name: discounts
#
#  id         :integer(8)      not null, primary key
#  name       :string(255)
#  percent    :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(8)
#

