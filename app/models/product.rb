class Product < ActiveRecord::Base

  PRODUCT_IMAGE_DIRECTORY = "#{Rails.root}/public/images/product_images/*"
  
  has_attached_file :product_image, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })
  
  before_post_process :transliterate_file_name
  before_validation :strip_whitespace, :only => [:name, :brand, :description]
  
  belongs_to :category
  belongs_to :tax_rate
  belongs_to :order_item_addition_grid
  
  belongs_to :modifier_category
  has_many :order_items
  has_many :menu_items, :dependent => :destroy
  
  has_many :stock_transactions, :order => "CREATED_AT"
  
  belongs_to :menu_page_1, :class_name => "MenuPage"
  belongs_to :menu_page_2, :class_name => "MenuPage"
  
  validates :name, :presence => true, :uniqueness => true
  validates :upc, :uniqueness => true, :allow_blank => true
  validates :category_id, :numericality => true, :allow_blank => true
  validates :size, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  validates :price, :presence => true, :numericality => {:greater_than_or_equal_to => 0}
  
  validates :double_price, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  
  validates :price_2, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  validates :price_3, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  validates :price_4, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  
  validates :items_per_unit, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  validates :sales_tax_rate, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}, :allow_blank => true
  validates :margin_percent, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}, :allow_blank => true
  validates :commission_percent, :numericality => {:greater_than_or_equal_to => 0, :less_than_or_equal_to => 100}, :allow_blank => true

  validates :cost_price, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  validates :shipping_cost, :numericality => {:greater_than_or_equal_to => 0}, :allow_blank => true
  
  VALID_BUTTON_WIDTHS = [1, 2, 3, 4, 5]
  VALID_BUTTON_HEIGHTS = [1]
  
  validates :menu_button_width, :presence => true, :inclusion => { :in => VALID_BUTTON_WIDTHS }
  validates :menu_button_height, :presence => true, :inclusion => { :in => VALID_BUTTON_HEIGHTS }
  
  after_create :set_image
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10

  def has_product_image?
    return (!product_image_file_name.nil? and !product_image_file_name.blank?)
  end
  
  def self.categoryless
    where(:category_id => nil).where(:is_deleted => false)
  end
  
  def self.non_deleted 
    where(:is_deleted => false).order(:name)
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
  
  def mark_as_deleted
    self.name += "_deleted_#{Time.now.to_i}"
    self.is_deleted = true
    save!
    
    #remove the product from all menu_pages deleting menu_items
    self.menu_items.each do |menu_item|
      MenuItem.delete_menu_item(menu_item)
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
    @decrement_val = quantity/quantity_per_container
    decrement!(:quantity_in_stock, @decrement_val)
  end
  
  def last_stock_transaction
    stock_transactions
  end
  
  def set_image
    @product_name_normalised = self.name.downcase.gsub(" ", "-")
    @product_name_parts = self.name.downcase.split(" ")
    
    @found_image = false
    
    #fetch all images in the product images directory
    @all_images = Dir.glob(PRODUCT_IMAGE_DIRECTORY)
    
    @all_images.each do |image_name|
      #strip white space and the .*** part
      @last_slash_index = image_name.rindex("/")
      @last_dot_index = image_name.rindex(".")
      
      next unless @last_slash_index
      next unless @last_dot_index
      
      @start_index = @last_slash_index + 1
      @end_index = @last_dot_index - 1
      @image_name = image_name[@start_index..@end_index].downcase
      
      if @product_name_normalised == @image_name
        @found_image = true
        self.display_image = image_name[@start_index..image_name.length]
        self.save
        break
      end
    end
  end
  
  def transliterate_file_name
    extension = File.extname(product_image_file_name).gsub(/^\.+/, '')
    filename = product_image_file_name.gsub(/\.#{extension}$/, '')
    self.product_image.instance_write(:file_name, "#{transliterate(filename)}.#{transliterate(extension)}")
  end
  
  def transliterate(str)
    # Based on permalink_fu by Rick Olsen

    # Escape str by transliterating to UTF-8 with Iconv
    s = Iconv.iconv('ascii//ignore//translit', 'utf-8', str).to_s

    # Downcase string
    s.downcase!

    # Remove apostrophes so isn't changes to isnt
    s.gsub!(/'/, '')

    # Replace any non-letter or non-number character with a space
    s.gsub!(/[^A-Za-z0-9]+/, ' ')

    # Remove spaces from beginning and end of string
    s.strip!

    # Replace groups of spaces with single hyphen
    s.gsub!(/\ +/, '-')

    return s
  end
  
  def strip_whitespace
    self.name = self.name ? self.name.strip : nil
    self.brand = self.brand ? self.brand.strip : nil
    self.description = self.description ? self.description.strip : nil
  end
  
end








# == Schema Information
#
# Table name: products
#
#  id                                       :integer(4)      not null, primary key
#  brand                                    :string(255)
#  name                                     :string(255)
#  category_id                              :integer(4)
#  description                              :string(255)
#  size                                     :float
#  unit                                     :string(255)
#  items_per_unit                           :integer(4)
#  sales_tax_rate                           :float
#  price                                    :float
#  created_at                               :datetime
#  updated_at                               :datetime
#  product_image_file_name                  :string(255)
#  product_image_content_type               :string(255)
#  product_image_file_size                  :integer(4)
#  product_image_updated_at                 :datetime
#  modifier_category_id                     :integer(4)
#  tax_rate_id                              :integer(4)
#  parent_product_id                        :integer(4)
#  printers                                 :string(255)     default("")
#  quantity_in_stock                        :float           default(0.0)
#  code_num                                 :integer(4)
#  upc                                      :string(255)
#  price_2                                  :float
#  price_3                                  :float
#  price_4                                  :float
#  margin_percent                           :float
#  cost_price                               :float
#  shipping_cost                            :float
#  commission_percent                       :float
#  container_type_id                        :integer(4)
#  quantity_per_container                   :float           default(1.0)
#  is_active                                :boolean(1)      default(TRUE)
#  is_service                               :boolean(1)      default(FALSE)
#  show_price_prompt                        :boolean(1)      default(FALSE)
#  show_quantity_prompt                     :boolean(1)      default(FALSE)
#  show_serial_num_prompt                   :boolean(1)      default(FALSE)
#  show_add_note_prompt                     :boolean(1)      default(FALSE)
#  sell_if_out_of_stock                     :boolean(1)      default(TRUE)
#  show_on_web                              :boolean(1)      default(TRUE)
#  notify_stock_manager                     :boolean(1)      default(TRUE)
#  use_weigh_scales                         :boolean(1)      default(FALSE)
#  minimum_quantity                         :float           default(1.0)
#  order_quantity                           :float
#  supplier_1_id                            :integer(4)
#  supplier_1_cost                          :float
#  supplier_1_code_num                      :float
#  supplier_2_id                            :integer(4)
#  supplier_2_cost                          :float
#  supplier_2_code_num                      :float
#  button_text_line_1                       :string(255)
#  button_text_line_2                       :string(255)
#  button_text_line_3                       :string(255)
#  button_bg_color                          :string(255)
#  button_text_color                        :string(255)
#  button_vertical_align                    :string(255)
#  show_button_image                        :boolean(1)      default(TRUE)
#  menu_button_width                        :integer(4)      default(1)
#  menu_button_height                       :integer(4)      default(1)
#  menu_page_1_id                           :string(255)
#  menu_page_2_id                           :string(255)
#  button_bg_color_2                        :string(255)
#  is_special                               :boolean(1)      default(FALSE)
#  is_deleted                               :boolean(1)      default(FALSE)
#  show_price_on_receipt                    :boolean(1)      default(TRUE)
#  double_price                             :float           default(0.0)
#  display_image                            :string(255)
#  hide_on_printed_receipt                  :boolean(1)      default(FALSE)
#  order_item_addition_grid_id              :integer(4)
#  order_item_addition_grid_id_is_mandatory :boolean(1)      default(FALSE)
#

