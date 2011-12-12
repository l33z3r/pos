class Display < ActiveRecord::Base
  has_many :display_buttons
  has_many :menu_pages, :dependent => :destroy, :order => "page_num"
  has_many :menu_items, :through => :menu_pages
  has_many :terminal_display_links, :dependent => :destroy
  
  belongs_to :order_item_addition_grid
  
  alias_method :order_item_addition_grid_original, :order_item_addition_grid
  
  validates :name, :presence => true, :uniqueness => true

  #load the default grid and link it if none already linked
  def order_item_addition_grid
    if !order_item_addition_grid_original
      #load the default grid
      self[:order_item_addition_grid_id] = OrderItemAdditionGrid.load_default.id
      save!
    end
    
    order_item_addition_grid_original
  end
  
  def self.load_default
    display = find_by_is_default(true)

    if !display
      display = find(:first)
      display.is_default = true
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
#  id                          :integer(4)      not null, primary key
#  name                        :string(255)
#  created_at                  :datetime
#  updated_at                  :datetime
#  is_default                  :boolean(1)      default(FALSE)
#  order_item_addition_grid_id :integer(4)
#

