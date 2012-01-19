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
  
  def check_for_unique
    @entered_terminal_id = params[:entered_terminal_id]
    
    if @entered_terminal_id == @terminal_id
      @terminal_id_free = true
    else
      @terminal_id_free = GlobalSetting.where("global_settings.key like ?", "#{GlobalSetting::TERMINAL_ID}%").where("global_settings.value = ?", @entered_terminal_id).empty?
    end
  end

end
