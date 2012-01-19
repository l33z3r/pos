class Admin::CustomThemesController < Admin::AdminController
  def index
  end

  def update_multiple
    @global_settings = GlobalSetting.update(params[:global_settings].keys, params[:global_settings].values).reject { |p| p.errors.empty? }
    
    if @global_settings.empty?
      flash[:notice] = "Settings Updated!"
      redirect_to :action => "index"
    else
      render :action => "index"
    end
  end

  def custom_theme
  end

end
