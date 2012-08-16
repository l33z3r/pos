class StoredReceiptHtml < ActiveRecord::Base
  
  belongs_to :outlet
  
  TERMINAL = "terminal"
  EMPLOYEE = "employee"
  TABLE = "table"
  
  VALID_RECEIPT_TYPES = [TERMINAL, EMPLOYEE, TABLE]
  
  validates :receipt_type, :presence => true, :inclusion => { :in => VALID_RECEIPT_TYPES }
  validates :receipt_key, :presence => true
  
  def self.latest_for_terminal terminal_id
    find(:first, :conditions => "receipt_type = '#{TERMINAL}' and receipt_key = '#{terminal_id}'", :order => "created_at DESC")
  end
  
  def self.latest_for_server employee_id
    find(:first, :conditions => "receipt_type = '#{EMPLOYEE}' and receipt_key = '#{employee_id}'", :order => "created_at DESC")
  end
  
  def self.latest_for_table table_label
    find(:first, :conditions => "receipt_type = '#{TABLE}' and receipt_key = '#{table_label}'", :order => "created_at DESC")
  end
  
end

# == Schema Information
#
# Table name: stored_receipt_htmls
#
#  id           :integer(4)      not null, primary key
#  receipt_type :string(255)
#  receipt_key  :string(255)
#  stored_html  :text
#  created_at   :datetime
#  updated_at   :datetime
#  outlet_id    :integer(4)
#

