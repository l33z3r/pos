class Printer < ActiveRecord::Base
  belongs_to :outlet
  
  validates :label, :presence => true
  validates_uniqueness_of :label, :case_sensitive => false, :scope => :outlet_id
  
  validates :network_path, :presence => true
  validates_uniqueness_of :network_path, :case_sensitive => false, :scope => :outlet_id
  
  before_save :downcase_fields
  
  def downcase_fields
    self.label.downcase.gsub!(/^\.+/, '')
    self.network_path.downcase
  end
  
  def name_for_select
    "#{label} (#{network_path})"  
  end
  
  def self.options_for_select current_outlet
    @options = []
    
    current_outlet.printers.each do |pr|
      @options << [pr.name_for_select, pr.id]
    end
    
    #the none option
    @options << ["Not Set", "-1"]
    
    @options
  end
end



# == Schema Information
#
# Table name: printers
#
#  id             :integer(4)      not null, primary key
#  outlet_id      :integer(4)
#  label          :string(255)
#  network_path   :string(255)
#  paper_width_mm :integer(4)      default(80)
#  font_size      :integer(4)      default(13)
#  created_at     :datetime
#  updated_at     :datetime
#

