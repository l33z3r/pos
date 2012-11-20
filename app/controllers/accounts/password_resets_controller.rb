class Accounts::PasswordResetsController < Accounts::ApplicationController
  skip_before_filter :ensure_logged_in    
  
  layout :choose_layout
  
  def new 
    
  end
  
  def create
    @entered_email = params[:email]
    @password_reset_cluey_account = ClueyAccount.find_by_email(@entered_email)
    
    if @password_reset_cluey_account and @password_reset_cluey_account.activated? and @password_reset_cluey_account.id == @cluey_account.id
      @password_reset_cluey_account.send_password_reset     
    else
      flash[:error] = "Email address #{@entered_email} is not valid for account #{@cluey_account.name}"
      render :new
    end
  end

  def edit
    @cluey_account = ClueyAccount.find_by_password_reset_token(params[:id])
    
    if !@cluey_account
      flash[:error] = "Password Reset Request Not Found"
      redirect_to account_log_in_path
      return
    end
  end

  def update
    @cluey_account = ClueyAccount.find_by_password_reset_token!(params[:id])
    
    if @cluey_account.password_reset_sent_at < 2.hours.ago
      redirect_to new_accounts_password_reset_path, :alert => "Password reset has expired."
    else
      @cluey_account.updating_password = true
      @cluey_account.update_attributes(params[:cluey_account])
      
      if @cluey_account.valid?
        @cluey_account.password_reset_token = nil
        @cluey_account.password_reset_token = nil
        @cluey_account.save
        
        redirect_to account_log_in_path, :notice => "Password has been reset"
      else
        render :edit
      end
    end
  end
  
  private 
  
  def choose_layout
    @accounts_logged_out_layout_action_array = ["new", "create", "edit", "update"]
    
    if @accounts_logged_out_layout_action_array.include? action_name
      return "accounts_logged_out"
    else 
      return "accounts"
    end
  end

end
