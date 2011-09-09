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

  has_many :products, :through => :menu_items, :order => "menu_items.order_num"
  
  validates :name, :presence => true
  validates :display_id, :presence => true, :numericality => true
  validates :page_num, :presence => true, :numericality => true
  
  def self.select_opts
    #create a blank menu_page
    @blank_menu_page = MenuPage.new(:id => -1, :name => "None")
    
    @options = Display.load_default.menu_pages.to_a
    @options.unshift @blank_menu_page
    
    @options.collect{|p| [p.name, p.id]}
  end
end
