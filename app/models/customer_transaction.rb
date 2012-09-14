class CustomerTransaction < ActiveRecord::Base
  belongs_to :order
  belongs_to :customer
  
  belongs_to :payment
  
  SETTLEMENT = "settlement"
  CHARGE = "charge"
  MISC_CREDIT = "misc_credit"
  MISC_DEBIT = "misc_debit"
  
  VALID_TRANSACTION_TYPES = [SETTLEMENT, CHARGE, MISC_CREDIT, MISC_DEBIT]
  
  validates :transaction_type, :presence => true, :inclusion => { :in => VALID_TRANSACTION_TYPES }
  
end



# == Schema Information
#
# Table name: customer_transactions
#
#  id               :integer(4)      not null, primary key
#  customer_id      :integer(4)
#  transaction_type :string(255)
#  order_id         :integer(4)
#  is_credit        :boolean(1)      default(TRUE), not null
#  abs_amount       :float           default(0.0), not null
#  actual_amount    :float           default(0.0), not null
#  created_at       :datetime
#  updated_at       :datetime
#  payment_id       :integer(4)
#  terminal_id      :string(255)
#

