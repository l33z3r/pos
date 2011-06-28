class Admin::HomeController < Admin::AdminController
  
  def custom_theme
    
  end
  
  def sync_info
    if params[:clear_sync_infos]
      TerminalSyncData.transaction do
        TerminalSyncData.find(:all, :lock => true).each do |tsd|
          tsd.destroy
        end
      end
      
      flash[:notice] = "All Sync Data Destroyed!"
      redirect_to :sync_info
    end
    
    @sync_infos = sync_table_order_times
  end

end
