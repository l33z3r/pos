class DisplaySweeper < ActionController::Caching::Sweeper
  observe Display, MenuPage, MenuItem # This sweeper is going to keep an eyeon all models used in the menu
 
  # If our sweeper detects that a record was created call this
  def after_create(record)
    expire_cache_for(record)
  end
 
  # If our sweeper detects that a record was updated call this
  def after_update(record)
    expire_cache_for(record)
  end
 
  # If our sweeper detects that a record was deleted call this
  def after_destroy(record)
    expire_cache_for(record)
  end
 
  private
  
  def expire_cache_for(record)
    RAILS_DEFAULT_LOGGER.info "Clearing cache in display sweeper!!!"
    
    #the menu items screen, in case this record appears there
    expire_fragment("menu_items_screen")
  end
  
end
