# == Schema Information
# Schema version: 20110709145601
#
# Table name: stored_receipt_htmls
#
#  id           :integer(4)      not null, primary key
#  receipt_type :string(255)
#  receipt_key  :string(255)
#  stored_html  :text
#  created_at   :datetime
#  updated_at   :datetime
#

class StoredReceiptHtml < ActiveRecord::Base
  
  TERMINAL = "terminal"
  EMPLOYEE = "employee"
  TABLE = "table"
  
  VALID_RECEIPT_TYPES = [TERMINAL, EMPLOYEE, TABLE]
  
  validates :receipt_type, :presence => true, :inclusion => { :in => VALID_RECEIPT_TYPES }
  validates :receipt_key, :presence => true
  
  def self.latest_for_terminal terminal_id
    find(:first, :conditions => "receipt_type = '#{TERMINAL}' and receipt_key = '#{terminal_id}'", :order => "created_at DESC")
  end
  
end
