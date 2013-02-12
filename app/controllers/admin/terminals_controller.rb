class Admin::TerminalsController < Admin::AdminController

  def index
    @latest_terminals = GlobalSetting.latest_terminals current_outlet
    @older_terminals = GlobalSetting.older_terminals current_outlet
    @displays = current_outlet.displays.all
  end
  
  def link_display
    @display = current_outlet.displays.find(params[:display_id])
    @selected_terminal_id = params[:terminal_id]
    
    @tld = TerminalDisplayLink.for_terminal @selected_terminal_id, current_outlet
    
    if !@tld
      TerminalDisplayLink.create({:outlet_id => current_outlet.id, :terminal_id => @selected_terminal_id, :display_id => @display.id})
    else 
      @tld.display_id = @display.id
      @tld.save!
    end
    
    request_reload_app @terminal_id
    
    render :json => {:success => true}.to_json
  end

end
