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
    render :action=> 'new' and return unless check_captcha(false)
    
    @outlet.cluey_account_id = current_cluey_account.id
    
    if @outlet.save
      OutletBuilder::build_outlet_seed_data(@outlet.id)
      
      flash[:notice] = "Outlet #{@outlet.name} created!"
      redirect_to accounts_outlets_path
    else
      render "new"
    end
  end
  
  def show
    @outlet = current_cluey_account.outlets.find(params[:id])
  end
  
  def new_terminal
    @outlet = current_cluey_account.outlets.find(params[:id])
    @outlet_terminal = @outlet.outlet_terminals.build
  end
  
  def create_terminal
    @outlet_terminal = OutletTerminal.new(params[:outlet_terminal])
    
    if @outlet_terminal.save
      flash[:notice] = "Terminal #{@outlet_terminal.name} added!"
      redirect_to accounts_outlet_path(@outlet)
    else
      @outlet = current_cluey_account.outlets.find(params[:id])
      render "new_terminal"
    end
  end
  
end