class TerminalDisplayLink < ActiveRecord::Base
  belongs_to :display
  
  def self.for_terminal terminal_id
    @res = where("terminal_id = ?", terminal_id)
    
    @res.size == 0 ? nil : @res.first
  end
  
  def self.load_display_for_terminal terminal_id
    @link_obj = where("terminal_id = ?", terminal_id)
    
    if @link_obj.size > 0
      @display = @link_obj.first.display
    else
      @display = Display.load_default
    end
  end
end
