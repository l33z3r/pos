class ReceiptFooter < ActiveRecord::Base
  validates :name, :presence => true
  validates :name, :uniqueness => true
  
  has_many :payment_methods, :dependent => :nullify
end

# == Schema Information
#
# Table name: receipt_footers
#
#  id      :integer(4)      not null, primary key
#  name    :string(255)
#  content :text
#

