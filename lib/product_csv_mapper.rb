class ProductCSVMapper
  
  DEPARTMENT_INDEX = 0
  CATEGORY_INDEX = 1
  NAME_INDEX = 2
  BRAND_INDEX = 3
  DESCRIPTION_INDEX = 4
  PRICE_INDEX = 5
  DOUBLE_PRICE_INDEX = 6
  HALF_PRICE_INDEX = 7
  CODE_NUM_INDEX = 8
  UPC_INDEX = 9
  PRICE_2_INDEX = 10
  PRICE_3_INDEX = 11
  PRICE_4_INDEX = 12
  MARGIN_PERCENT_INDEX = 13
  ITEMS_PER_UNIT_INDEX = 14
  QUANTITY_PER_CONTAINER_INDEX = 15
  COST_PRICE_INDEX = 16
  UNIT_INDEX = 17
  SIZE_INDEX = 18
  
  def self.product_from_row row, current_outlet
    @new_product = Product.new
      
    @new_product.outlet_id = current_outlet.id
    
    @new_product.name = name_from_row row
    @new_product.brand = brand_from_row row
    @new_product.description = description_from_row row
      
    @new_product.price = price_from_row row
    @new_product.double_price = double_price_from_row row
    @new_product.half_price = half_price_from_row row
      
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
      
    @new_product.cost_price = cost_price_from_row row
    
    #unit size
    @new_product.size = size_from_row row
    
    @new_product
  end
  
  def self.department_from_row row
    get_index row, DEPARTMENT_INDEX
  end
  
  def self.category_from_row row
    get_index row, CATEGORY_INDEX
  end
  
  def self.name_from_row row
    get_index row, NAME_INDEX
  end
  
  def self.brand_from_row row
    get_index row, BRAND_INDEX
  end
  
  def self.description_from_row row
    get_index row, DESCRIPTION_INDEX
  end
  
  def self.price_from_row row
    get_index row, PRICE_INDEX 
  end
      
  def self.double_price_from_row row
    double_price = get_index row, DOUBLE_PRICE_INDEX
    
    if double_price.blank?
      double_price = 0
    end
    
    return double_price
  end
  
  def self.half_price_from_row row
    half_price = get_index row, HALF_PRICE_INDEX
    
    if half_price.blank?
      half_price = 0
    end
    
    return half_price
  end
  
  def self.code_num_from_row row
    get_index row, CODE_NUM_INDEX
  end
  
  def self.upc_from_row row
    get_index row, UPC_INDEX
  end
  
  def self.price_2_from_row row
    price_2 = get_index row, PRICE_2_INDEX
    
    if price_2.blank?
      price_2 = 0
    end
    
    return price_2
  end
  
  def self.price_3_from_row row
    price_3 = get_index row, PRICE_3_INDEX
    
    if price_3.blank?
      price_3 = 0
    end
    
    return price_3
  end
  
  def self.price_4_from_row row
    price_4 = get_index row, PRICE_4_INDEX
    
    if price_4.blank?
      price_4 = 0
    end
    
    return price_4
  end
  
  def self.margin_percent_from_row row
    margin_percent = get_index row, MARGIN_PERCENT_INDEX
    
    if margin_percent.blank?
      margin_percent = 0
    end
    
    return margin_percent
  end
  
  def self.items_per_unit_from_row row
    items_per_unit = get_index row, ITEMS_PER_UNIT_INDEX
    
    if items_per_unit.blank?
      items_per_unit = 1
    end
    
    return items_per_unit
  end
  
  def self.quantity_per_container_from_row row
    quantity_per_container = get_index row, QUANTITY_PER_CONTAINER_INDEX
    
    if quantity_per_container.blank?
      quantity_per_container = 1
    end
    
    return quantity_per_container
  end
  
  def self.cost_price_from_row row
    get_index row, COST_PRICE_INDEX
    
    cost_price = get_index row, COST_PRICE_INDEX
    
    if cost_price.blank?
      cost_price = 0
    end
    
    return cost_price
  end
  
  def self.unit_from_row row
    get_index row, UNIT_INDEX
  end
  
  def self.size_from_row row
    size = get_index row, SIZE_INDEX
    
    if size.blank?
      size = 0
    end
    
    return size
  end
  
  def self.get_index row, index
    if row[index]
      return row[index].strip.length > 0 ? row[index].strip : nil
    else
      return nil
    end
  end
end