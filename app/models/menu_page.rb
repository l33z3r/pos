# == Schema Information
# Schema version: 20110331125705
#
# Table name: menu_pages
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  display_id :integer(4)
#  page_num   :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class MenuPage < ActiveRecord::Base
  belongs_to :display
  has_many :menu_items, :dependent => :destroy, :order => "order_num"

  validates :name, :presence => true
  validates :display_id, :presence => true, :numericality => true
  validates :page_num, :presence => true, :numericality => true
end
