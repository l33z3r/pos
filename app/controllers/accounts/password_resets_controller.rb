class Accounts::PasswordResetsController < Accounts::ApplicationController
  skip_before_filter :ensure_logged_in
  
  def create
    @cluey_account = ClueyAccount.find_by_email(params[:email])
    
    if @cluey_account and @cluey_account.activated?
      @cluey_account.send_password_reset 
    end
  end

  def edit
    @cluey_account = ClueyAccount.find_by_password_reset_token(params[:id])
    
    if !@cluey_account
      flash[:error] = "Reset Request Not Found!"
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
        
        redirect_to account_log_in_path, :notice => "Password has been reset!"
      else
        render :edit
      end
    end
  end

end
