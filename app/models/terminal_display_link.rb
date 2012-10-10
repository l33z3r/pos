class TerminalDisplayLink < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :display
  
  def self.for_terminal terminal_id, current_outlet
    @res = current_outlet.terminal_display_links("terminal_id = ?", terminal_id)
    
    @res.size == 0 ? nil : @res.first
  end
  
  def self.load_display_for_terminal terminal_id, current_outlet
    @link_obj = current_outlet.terminal_display_links.where("terminal_id = ?", terminal_id)
    
    if @link_obj.size > 0
      @display = @link_obj.first.display
    else
      @display = Display.load_default current_outlet
    end
  end
end



# == Schema Information
#
# Table name: terminal_display_links
#
#  id          :integer(8)      not null, primary key
#  terminal_id :string(255)
#  display_id  :integer(8)
#  created_at  :datetime
#  updated_at  :datetime
#  outlet_id   :integer(8)
#

