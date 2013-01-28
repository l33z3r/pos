class Printer < ActiveRecord::Base
  belongs_to :outlet
  
  validates :label, :presence => true
  validates_uniqueness_of :label, :case_sensitive => false, :scope => :outlet_id
  
  validates_uniqueness_of :network_share_name, :case_sensitive => false, :scope => :outlet_id, :allow_blank => true
  
  before_save :downcase_fields
  
  LOCAL = 1
  KITCHEN_1 = 2
  BAR_1 = 3
  KITCHEN_2 = 4
  BAR_2 = 5
  OTHER = 6
  
  VALID_PRINTER_TYPES = [LOCAL, KITCHEN_1, BAR_1, KITCHEN_2, BAR_2, OTHER]
  
  KITCHEN_1_PRINTER_SYMBOL = "K"
  BAR_1_PRINTER_SYMBOL = "B"
  KITCHEN_2_PRINTER_SYMBOL = "K1"
  BAR_2_PRINTER_SYMBOL = "B2"
  
  validates :printer_type, :numericality => true, :inclusion => { :in => VALID_PRINTER_TYPES }
  
  PRINTER_TYPE_LABELS = {
    LOCAL => "Local",
    KITCHEN_1 => "Kitchen",
    BAR_1 => "Bar",
    KITCHEN_2 => "Kitchen 2",
    BAR_2 => "Bar 2",
    OTHER => "Other"
  }
  
  def in_use?
    !local_printer.blank?
  end
  
  def downcase_fields
    self.label.downcase.gsub!(/^\.+/, '')
    self.local_printer.downcase
    self.network_share_name.downcase
  end
  
  def name_for_select
    "#{label} (#{network_share_name})"  
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
  
  def self.label_for_printer_type printer_type
    PRINTER_TYPE_LABELS[printer_type]
  end
  
  def self.get_printer_for_symbol sym, current_outlet
    if sym == KITCHEN_1_PRINTER_SYMBOL
      return current_outlet.printers.where("printer_type = ?", Printer::KITCHEN_1).first
    elsif sym == BAR_1_PRINTER_SYMBOL
      return current_outlet.printers.where("printer_type = ?", Printer::BAR_1).first
    elsif sym == KITCHEN_2_PRINTER_SYMBOL
      return current_outlet.printers.where("printer_type = ?", Printer::KITCHEN_2).first
    elsif sym == BAR_2_PRINTER_SYMBOL
      return current_outlet.printers.where("printer_type = ?", Printer::BAR_2).first
    end
  end
end









# == Schema Information
#
# Table name: printers
#
#  id                 :integer(8)      not null, primary key
#  outlet_id          :integer(8)
#  label              :string(255)
#  local_printer      :string(255)
#  paper_width_mm     :integer(4)      default(80)
#  font_size          :integer(4)      default(13)
#  created_at         :datetime
#  updated_at         :datetime
#  owner_fingerprint  :string(255)
#  printer_type       :integer(4)
#  network_share_name :string(255)
#

