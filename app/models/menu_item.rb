class MenuItem < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :menu_page
  belongs_to :product

  validates :menu_page_id, :presence => true, :numericality => true

  def name
    product.try(:name)
  end
  
  def self.delete_menu_item menu_item
    #shift the order number down on all following menu items
    @menu_items_to_shift = menu_item.menu_page.menu_items.where("order_num > #{menu_item.order_num}")
    
    @menu_items_to_shift.each do |mi|
      mi.order_num -=1
      mi.save
    end

    menu_item.destroy
  end
end


# == Schema Information
#
# Table name: menu_items
#
#  id           :integer(8)      not null, primary key
#  menu_page_id :integer(8)
#  product_id   :integer(8)
#  created_at   :datetime
#  updated_at   :datetime
#  order_num    :integer(4)      default(0)
#  outlet_id    :integer(8)
#

