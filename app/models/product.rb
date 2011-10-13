class Product < ActiveRecord::Base

  has_attached_file :product_image, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })
  
  belongs_to :category
  belongs_to :tax_rate
  
  belongs_to :modifier_category
  has_many :order_items
  has_many :menu_items, :dependent => :destroy
  
  belongs_to :menu_page_1, :class_name => "MenuPage"
  belongs_to :menu_page_2, :class_name => "MenuPage"
  
  validates :name, :presence => true
  validates :category_id, :numericality => true, :allow_blank => true
  validates :size, :numericality => true, :allow_blank => true
  validates :price, :presence => true, :numericality => true
  validates :items_per_unit, :numericality => true, :allow_blank => true
  validates :sales_tax_rate, :numericality => true, :allow_blank => true

  VALID_BUTTON_WIDTHS = [1, 2, 3, 4, 5]
  VALID_BUTTON_HEIGHTS = [1]
  
  validates :menu_button_width, :presence => true, :inclusion => { :in => VALID_BUTTON_WIDTHS }
  validates :menu_button_height, :presence => true, :inclusion => { :in => VALID_BUTTON_HEIGHTS }
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def has_product_image?
    return (!product_image_file_name.nil? and !product_image_file_name.blank?)
  end
  
  def self.categoryless
    find_all_by_category_id(nil)
  end
  
  def sales_tax_rate
    if tax_rate_id.blank?
      if category_id
        if category.tax_rate_id.blank?
          TaxRate.load_default.rate
        else
          category.tax_rate.rate
        end
      else
        TaxRate.load_default.rate
      end
    else
      tax_rate.rate
    end
  end
  
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
  
  def decrement_stock quantity
    decrement!(:quantity_in_stock, quantity)
  end
  
end
# == Schema Information
#
# Table name: products
#
#  id                         :integer(4)      not null, primary key
#  brand                      :string(255)
#  name                       :string(255)
#  category_id                :integer(4)
#  description                :string(255)
#  size                       :float
#  unit                       :string(255)
#  items_per_unit             :integer(4)
#  sales_tax_rate             :float
#  price                      :float
#  created_at                 :datetime
#  updated_at                 :datetime
#  product_image_file_name    :string(255)
#  product_image_content_type :string(255)
#  product_image_file_size    :integer(4)
#  product_image_updated_at   :datetime
#  modifier_category_id       :integer(4)
#  tax_rate_id                :integer(4)
#  parent_product_id          :integer(4)
#  printers                   :string(255)     default("")
#  kitchen_note               :text
#  quantity_in_stock          :float
#  code_num                   :integer(4)
#  upc                        :integer(4)
#  price_2                    :float
#  price_3                    :float
#  price_4                    :float
#  margin_percent             :float
#  cost_price                 :float
#  shipping_cost              :float
#  commission_percent         :float
#  container_type_id          :integer(4)
#  quantity_per_container     :float
#  is_active                  :boolean(1)      default(TRUE)
#  is_service                 :boolean(1)      default(FALSE)
#  show_price_prompt          :boolean(1)      default(FALSE)
#  show_quantity_prompt       :boolean(1)      default(FALSE)
#  show_serial_num_prompt     :boolean(1)      default(FALSE)
#  show_add_note_prompt       :boolean(1)      default(FALSE)
#  sell_if_out_of_stock       :boolean(1)      default(TRUE)
#  show_on_web                :boolean(1)      default(TRUE)
#  notify_stock_manager       :boolean(1)      default(TRUE)
#  use_weigh_scales           :boolean(1)      default(FALSE)
#  minimum_quantity           :float           default(1.0)
#  order_quantity             :float
#  supplier_1_id              :integer(4)
#  supplier_1_cost            :float
#  supplier_1_code_num        :float
#  supplier_2_id              :integer(4)
#  supplier_2_cost            :float
#  supplier_2_code_num        :float
#  button_text_line_1         :string(255)
#  button_text_line_2         :string(255)
#  button_text_line_3         :string(255)
#  button_bg_color            :string(255)
#  button_text_color          :string(255)
#  button_vertical_align      :string(255)
#  show_button_image          :boolean(1)      default(TRUE)
#  menu_button_width          :integer(4)      default(1)
#  menu_button_height         :integer(4)      default(1)
#  menu_page_1_id             :string(255)
#  menu_page_2_id             :string(255)
#

