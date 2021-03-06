#THIS RECORDS A CHARGE ROOM TRANSACTION

class ClientTransaction < ActiveRecord::Base
  belongs_to :order
  serialize :transaction_data, Hash
  validates :payment_integration_type_id, :presence => true, :inclusion => { :in => PaymentMethod::PAYMENT_INTEGRATION_TYPES }
end

# == Schema Information
#
# Table name: client_transactions
#
#  id                          :integer(4)      not null, primary key
#  order_id                    :integer(4)
#  payment_integration_type_id :integer(4)
#  client_name                 :string(255)
#  transaction_data            :text(2147483647
#  created_at                  :datetime
#  updated_at                  :datetime
#

