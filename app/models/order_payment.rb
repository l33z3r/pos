class OrderPayment < ActiveRecord::Base
  belongs_to :outlet
  belongs_to :order
end

# == Schema Information
#
# Table name: order_payments
#
#  id             :integer(4)      not null, primary key
#  order_id       :integer(8)
#  amount         :float
#  payment_method :string(255)
#  outlet_id      :integer(8)
#  created_at     :datetime
#  updated_at     :datetime
#

