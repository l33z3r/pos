class Payment < ActiveRecord::Base
  belongs_to :outlet
  
  has_one :customer_transaction
  belongs_to :card_transaction
  
  CUSTOMER_PAYMENT = "customer_payment"
  
  VALID_TRANSACTION_TYPES = [CUSTOMER_PAYMENT]
  
  validates :transaction_type, :presence => true, :inclusion => { :in => VALID_TRANSACTION_TYPES }
end





# == Schema Information
#
# Table name: payments
#
#  id                  :integer(8)      not null, primary key
#  transaction_type    :string(255)
#  employee_id         :integer(8)
#  card_transaction_id :integer(8)
#  amount              :float           default(0.0), not null
#  amount_tendered     :float           default(0.0), not null
#  payment_method      :string(255)
#  created_at          :datetime
#  updated_at          :datetime
#  terminal_id         :string(255)
#  outlet_id           :integer(8)
#

