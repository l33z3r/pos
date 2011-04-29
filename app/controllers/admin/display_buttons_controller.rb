class Admin::DisplayButtonsController < Admin::AdminController
  def access
    
  end

  def screen
    
  end

  def update_sales_screen_button_role
    @dbr = DisplayButtonRole.find(params[:id])
    @dbr.show_on_sales_screen = params[:checked]
    @dbr.save!
    
    render :inline => "{success : true}"
  end

  def update_admin_screen_button_role
    @dbr = DisplayButtonRole.find(params[:id])
    @dbr.show_on_admin_screen = params[:checked]
    @dbr.save!

    render :inline => "{success : true}"
  end
end
