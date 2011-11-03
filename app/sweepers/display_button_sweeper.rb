class DisplayButtonSweeper < ActionController::Caching::Sweeper
  observe DisplayButton, DisplayButtonRole, Employee, Role # This sweeper is going to keep an eyeon all models used in the display buttons
 
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
    RAILS_DEFAULT_LOGGER.info "Clearing cache in display button sweeper!!!"
    
    #the menu buttons
    expire_fragment("menu_screen_buttons")
    
    #the admin menu buttons
    expire_fragment("more_options_screen")
    
    update_html5_cache_timestamp
  end
  
end
