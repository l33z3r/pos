class Payment < ActiveRecord::Base
  has_one :customer_transaction
  
  CUSTOMER_PAYMENT = "customer_payment"
  
  VALID_TRANSACTION_TYPES = [CUSTOMER_PAYMENT]
  
  validates :transaction_type, :presence => true, :inclusion => { :in => VALID_TRANSACTION_TYPES }
end

# == Schema Information
#
# Table name: payments
#
#  id               :integer(4)      not null, primary key
#  transaction_type :string(255)
#  employee_id      :integer(4)
#  amount           :float           default(0.0), not null
#  amount_tendered  :float           default(0.0), not null
#  payment_method   :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

