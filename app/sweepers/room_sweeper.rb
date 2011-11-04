class RoomSweeper < ActionController::Caching::Sweeper
  observe Room, TableInfo, RoomObject # This sweeper is going to keep an eyeon all models used in the display buttons
 
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
    RAILS_DEFAULT_LOGGER.info "Clearing cache in room sweeper!!!"
    
    #the tables screen html
    expire_fragment("tables_screen")
    
    #the select dropdown for tables
    expire_fragment("room_select_dropdown")
  end
  
end
