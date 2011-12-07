class ProductCSVMapper
  
  DEPARTMENT_INDEX = 0
  CATEGORY_INDEX = 1
  NAME_INDEX = 2
  BRAND_INDEX = 3
  DESCRIPTION_INDEX = 4
  PRICE_INDEX = 5
  DOUBLE_PRICE_INDEX = 6
  CODE_NUM_INDEX = 7
  UPC_INDEX = 8
  PRICE_2_INDEX = 9
  PRICE_3_INDEX = 10
  PRICE_4_INDEX = 11
  MARGIN_PERCENT_INDEX = 12
  ITEMS_PER_UNIT_INDEX = 13
  QUANTITY_PER_CONTAINER_INDEX = 14
  UNIT_INDEX = 15
  SIZE_INDEX = 16
  
  def self.product_from_row row
    @new_product = Product.new
      
    @department = department_from_row row
    @category = category_from_row row
      
    @new_product.name = name_from_row row
    @new_product.brand = brand_from_row row
    @new_product.description = description_from_row row
      
    @new_product.price = price_from_row row
    @new_product.double_price = double_price_from_row row
      
    @new_product.code_num = code_num_from_row row
    @new_product.upc = upc_from_row row
      
    @new_product.price_2 = price_2_from_row row
    @new_product.price_3 = price_3_from_row row
    @new_product.price_4 = price_4_from_row row
      
    @new_product.margin_percent = margin_percent_from_row row
    @new_product.items_per_unit = items_per_unit_from_row row
    @new_product.quantity_per_container = quantity_per_container_from_row row
      
    #unit of measure
    @new_product.unit = unit_from_row row
      
    #unit size
    @new_product.size = size_from_row row
    
    @new_product
  end
  
  def self.department_from_row row
    row[DEPARTMENT_INDEX]
  end
  
  def self.category_from_row row
    row[CATEGORY_INDEX]
  end
  
  def self.name_from_row row
    row[NAME_INDEX]
  end
  
  def self.brand_from_row row
    row[BRAND_INDEX]
  end
  
  def self.description_from_row row
    row[DESCRIPTION_INDEX]
  end
  
  def self.price_from_row row
    row[PRICE_INDEX]
  end
      
  def self.double_price_from_row row
    row[DOUBLE_PRICE_INDEX]
  end
  
  def self.code_num_from_row row
    row[CODE_NUM_INDEX]
  end
  
  def self.upc_from_row row
    row[UPC_INDEX]
  end
  
  def self.price_2_from_row row
    row[PRICE_2_INDEX]
  end
  
  def self.price_3_from_row row
    row[PRICE_3_INDEX]
  end
  
  def self.price_4_from_row row
    row[PRICE_4_INDEX]
  end
  
  def self.margin_percent_from_row row
    row[MARGIN_PERCENT_INDEX]
  end
  
  def self.items_per_unit_from_row row
    row[ITEMS_PER_UNIT_INDEX]
  end
  
  def self.quantity_per_container_from_row row
    row[QUANTITY_PER_CONTAINER_INDEX]
  end
  
  def self.unit_from_row row
    row[UNIT_INDEX]
  end
  
  def self.size_from_row row
    row[SIZE_INDEX]
  end
  
end