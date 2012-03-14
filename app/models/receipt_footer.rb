class ReceiptFooter < ActiveRecord::Base
  validates :name, :presence => true
  validates :name, :uniqueness => true
  
  has_many :payment_methods
  
  before_save :validate_html
  
  def validate_html
    self.content = self.content.gsub("<hr />", "<hr></hr>")
    
    #must validate the html
  end
end
# == Schema Information
#
# Table name: receipt_footers
#
#  id      :integer(4)      not null, primary key
#  name    :string(255)
#  content :string(255)
#

