class Display < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :display_buttons
  has_many :menu_pages, :dependent => :destroy, :order => "page_num"
  has_many :menu_items, :through => :menu_pages
  has_many :terminal_display_links, :dependent => :destroy
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id

  def self.load_default current_outlet
    display = current_outlet.displays.find_by_is_default(true)

    if !display
      display = current_outlet.displays.find(:first)
      display.is_default = true
      display.save
    end
    
    display
  end
  
  def self.set_default display_id, current_outlet
    @old_default_display = Display.load_default current_outlet
    @old_default_display.is_default = false
    @old_default_display.save

    @new_default_display = current_outlet.displays.find display_id
    @new_default_display.is_default = true
    @new_default_display.save
  end
  
  def self.load_public current_outlet
    display = current_outlet.displays.find_by_is_public(true)

    if !display
      display = current_outlet.displays.find(:first)
      display.is_public = true
      display.save
    end
    
    display
  end
  
  def has_nested
    menu_pages.each do |mp|
      if mp.embedded_display_id
        return true
      end
    end
    
    return false
  end
  
end





# == Schema Information
#
# Table name: displays
#
#  id         :integer(8)      not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  is_default :boolean(1)      default(FALSE)
#  is_public  :boolean(1)      default(FALSE)
#  outlet_id  :integer(8)
#

