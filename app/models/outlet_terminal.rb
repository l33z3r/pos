class OutletTerminal < ActiveRecord::Base
  TERMINAL_TYPE_NORMAL = 1
  TERMINAL_TYPE_MOBILE = 2
  TERMINAL_TYPE_KITCHEN = 3
  
  VALID_TERMINAL_TYPES = [TERMINAL_TYPE_NORMAL, TERMINAL_TYPE_MOBILE, TERMINAL_TYPE_KITCHEN]
  
  VALID_TERMINAL_TYPES_MAP = {
    TERMINAL_TYPE_NORMAL => "Sales Terminal", 
    TERMINAL_TYPE_MOBILE => "Mobile", 
    TERMINAL_TYPE_KITCHEN => "Kitchen Screen"
  }
  
  serialize :data, Hash
  
  validates :terminal_type, :presence => true
  validates :terminal_type, :inclusion => { :in => VALID_TERMINAL_TYPES }

  belongs_to :outlet
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
  validates_format_of :name, :with => /^\w+$/i, :message => "can only contain letters and numbers."
  
  def self.options_for_select current_outlet
    @options = []
    @options << ["Not Set", "-1"]
    
    current_outlet.outlet_terminals.each do |ot|
      @options << [ot.name, ot.name]
    end
    
    @options
  end
  
  def self.terminal_types_for_select
    @options = []
    
    VALID_TERMINAL_TYPES_MAP.each do |terminal_type, terminal_type_label|
      @options << [terminal_type_label, terminal_type]
    end
    
    @options
  end
  
  def link_terminal terminal_id_gs
    terminal_id_gs.value = self.name
    terminal_id_gs.save
      
    self.assigned = true
    save
  end
  
  def unlink_terminal terminal_id_gs
    terminal_id_gs.value = "NT##{Time.now.to_i.to_s[-4,4]}"
    terminal_id_gs.save
      
    self.assigned = false
    save
  end
  
end




# == Schema Information
#
# Table name: outlet_terminals
#
#  id            :integer(8)      not null, primary key
#  outlet_id     :integer(8)
#  name          :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  assigned      :boolean(1)      default(FALSE)
#  terminal_type :integer(4)      default(1), not null
#

