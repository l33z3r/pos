class OutletTerminal < ActiveRecord::Base
  belongs_to :outlet
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
  
  def self.options_for_select current_outlet
    @options = []
    @options << ["Not Set", "-1"]
    
    current_outlet.outlet_terminals.each do |ot|
      @options << [ot.name, ot.name]
    end
    
    @options
  end
end

# == Schema Information
#
# Table name: outlet_terminals
#
#  id         :integer(4)      not null, primary key
#  outlet_id  :integer(4)
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

