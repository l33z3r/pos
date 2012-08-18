class Accounts::OutletsController < Accounts::ApplicationController
  def index
    @outlets = current_cluey_account.outlets.all
  end
  
  def new
    @outlet = Outlet.new
  end

  def create
    @outlet = Outlet.new(params[:outlet])
    
    #verify captcha
    render :action=>'new' and return unless check_captcha(false)
    
    @outlet.cluey_account_id = current_cluey_account.id
    
    if @outlet.save
      OutletBuilder::build_outlet_seed_data(@outlet.id)
      
      flash[:notice] = "Outlet #{@outlet.name} created!"
      redirect_to accounts_outlets_path
    else
      render "new"
    end
  end
  
end
