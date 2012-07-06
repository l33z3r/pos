class DeliveryController < ApplicationController

  def receive
    @success = true
    
    if @success
      render :json => {:success => true}.to_json
    else
      render :json => {:success => false}.to_json
    end
  end

end
