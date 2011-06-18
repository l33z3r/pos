class Admin::HomeController < Admin::AdminController
  
  def custom_theme
    
  end
  
  def sync_info
    if params[:clear_sync_infos]
      GLOBAL_DATA['sync_table_order_times'] = nil
      redirect_to :sync_info
    end
    
    @sync_infos = sync_table_order_times
  end

end
