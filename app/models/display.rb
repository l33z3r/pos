# == Schema Information
# Schema version: 20110429080107
#
# Table name: displays
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  is_default :boolean(1)
#

class Display < ActiveRecord::Base
  has_many :display_buttons
  has_many :menu_pages, :dependent => :destroy, :order => "page_num"
  has_many :menu_items, :through => :menu_pages
  
  validates :name, :presence => true, :uniqueness => true

  def self.load_default
    display = find_by_is_default(true)

    if !display
      display = find(:first)
    end

    display
  end
end
