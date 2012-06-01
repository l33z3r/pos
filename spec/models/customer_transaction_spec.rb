require 'spec_helper'

describe CustomerTransaction do
  pending "add some examples to (or delete) #{__FILE__}"
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
#  amount_tendered  :float           default(0.0), not null
#  payment_method   :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

