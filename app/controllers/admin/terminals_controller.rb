class Admin::TerminalsController < Admin::AdminController

  def index
    @latest_terminals = GlobalSetting.latest_terminals
    @older_terminals = GlobalSetting.older_terminals
    @displays = Display.all
  end
  
  def link_display
    @display = Display.find(params[:display_id])
    @selected_terminal_id = params[:terminal_id]
    
    @tld = TerminalDisplayLink.for_terminal @selected_terminal_id
    
    if !@tld
      TerminalDisplayLink.create({:terminal_id => @selected_terminal_id, :display_id => @display.id})
    else 
      @tld.display_id = @display.id
      @tld.save!
    end
    
    render :json => {:success => true}.to_json
  end

end
