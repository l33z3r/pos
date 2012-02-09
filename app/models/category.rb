class Category < ActiveRecord::Base
  has_many :products, :conditions => "products.is_deleted = false", :dependent => :nullify  
  has_many :products_including_deleted, :class_name => "Product", :dependent => :nullify 
  
  belongs_to :tax_rate
  belongs_to :order_item_addition_grid
  
  belongs_to :parent_category, :class_name => "Category"

  validates :name, :presence => true, :uniqueness => true
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def printing_to_terminal? id_safe_terminal_name
    @printers_string = read_attribute("printers")
    
    if @printers_string
      @printers_string.split(",").each do |terminal_name|
        return true if id_safe_terminal_name == terminal_name
      end
    end
    
    return false
  end
  
  def selected_printers=(selected_printers_array)
    
    #remove any empty strings from the selected_printers_array
    selected_printers_array.delete("")
    
    if selected_printers_array.size == 0
      printers_val = ""
    elsif selected_printers_array.size == 1
      printers_val = selected_printers_array[0].to_s
    else
      printers_val = selected_printers_array.join(",")
    end
    
    write_attribute("printers", printers_val)
  end
  
  def appearing_on_kitchen_screen? id_safe_terminal_name
    @kitchen_screens_string = read_attribute("kitchen_screens")
    
    if @kitchen_screens_string
      @kitchen_screens_string.split(",").each do |terminal_name|
        return true if id_safe_terminal_name == terminal_name
      end
    end
    
    return false
  end
  
  def selected_kitchen_screens=(selected_kitchen_screens_array)
    
    #remove any empty strings from the selected_kitchen_screens_array
    selected_kitchen_screens_array.delete("")
    
    if selected_kitchen_screens_array.size == 0
      kitchen_screens_val = ""
    elsif selected_kitchen_screens_array.size == 1
      kitchen_screens_val = selected_kitchen_screens_array[0].to_s
    else
      kitchen_screens_val = selected_kitchen_screens_array.join(",")
    end
    
    write_attribute("kitchen_screens", kitchen_screens_val)
  end
  
end





# == Schema Information
#
# Table name: categories
#
#  id                                       :integer(4)      not null, primary key
#  name                                     :string(255)
#  parent_category_id                       :integer(4)
#  description                              :string(255)
#  created_at                               :datetime
#  updated_at                               :datetime
#  tax_rate_id                              :integer(4)
#  printers                                 :string(255)     default("")
#  order_item_addition_grid_id              :integer(4)
#  order_item_addition_grid_id_is_mandatory :boolean(1)      default(FALSE)
#  course_num                               :integer(4)      default(0)
#

