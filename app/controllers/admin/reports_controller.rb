class Admin::ReportsController < Admin::AdminController
  
  def index
    @orders = Order.paginate :page => params[:page], :order => 'created_at desc'
  end
  
end
