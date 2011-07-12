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
      
      if !display
        display = Display.create({:name => "Default"})
        
        display.save!
        
        #give the display an initial 2 pages
        @page_1 = display.menu_pages.build({:name => "Favourites", :page_num => 1})
        @page_2 = display.menu_pages.build({:name => "Page 2", :page_num => 2})

        @page_1.save!
        @page_2.save!

        (1..16).each do |num|
          @page_1.menu_items.build({:order_num => num}).save!
          @page_2.menu_items.build({:order_num => num}).save!
        end
      end
      
      display.is_default = true
      display.save
    end

    display
  end
end
