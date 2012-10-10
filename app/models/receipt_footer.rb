class ReceiptFooter < ActiveRecord::Base
  belongs_to :outlet
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
  
  has_many :payment_methods, :dependent => :nullify
end



# == Schema Information
#
# Table name: receipt_footers
#
#  id        :integer(8)      not null, primary key
#  name      :string(255)
#  content   :text
#  outlet_id :integer(8)
#

