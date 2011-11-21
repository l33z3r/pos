class Category < ActiveRecord::Base
  has_many :products, :conditions => "products.is_deleted = false"
  
  belongs_to :tax_rate
  
  belongs_to :parent_category, :class_name => "Category"

  validates :name, :presence => true, :uniqueness => true
  validates :description, :presence => true
  
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
  
end

# == Schema Information
#
# Table name: categories
#
#  id                 :integer(4)      not null, primary key
#  name               :string(255)
#  parent_category_id :integer(4)
#  description        :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#  tax_rate_id        :integer(4)
#  printers           :string(255)
#

