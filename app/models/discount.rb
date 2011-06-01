# == Schema Information
# Schema version: 20110531092627
#
# Table name: discounts
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  percent    :float
#  is_default :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#

class Discount < ActiveRecord::Base
  validates :name, :presence => true
  validates :percent, :presence => true, :numericality => true
  
  has_many :orders
  has_many :order_items
  
  def name_for_select
    "#{name} (#{percent}%)"  
  end
  
  def self.load_default
    discount = find_by_is_default(true)
    
    if !discount
      discount = find(:first)
      discount.is_default = true
      discount.save
    end

    discount
  end
end
