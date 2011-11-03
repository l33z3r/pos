class ProductSweeper < ActionController::Caching::Sweeper
  observe Product # This sweeper is going to keep an eye on the Product model
 
  # If our sweeper detects that a Product was created call this
  def after_create(product)
    expire_cache_for(product)
  end
 
  # If our sweeper detects that a Product was updated call this
  def after_update(product)
    expire_cache_for(product)
  end
 
  # If our sweeper detects that a Product was deleted call this
  def after_destroy(product)
    expire_cache_for(product)
  end
 
  private
  
  def expire_cache_for(product)
    RAILS_DEFAULT_LOGGER.info "Clearing cache in product sweeper!!!"
    
    #the list of products in the admin section
    expire_fragment(%r{admin_product_list_page_*})
    
    #the menu items screen, in case this product appears there
    expire_fragment("menu_items_screen")
    
    update_html5_cache_timestamp
  end
  
end
