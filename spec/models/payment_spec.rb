require 'spec_helper'

describe Payment do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: payments
#
#  id                  :integer(4)      not null, primary key
#  transaction_type    :string(255)
#  employee_id         :integer(4)
#  card_transaction_id :integer(4)
#  amount              :float           default(0.0), not null
#  amount_tendered     :float           default(0.0), not null
#  payment_method      :string(255)
#  created_at          :datetime
#  updated_at          :datetime
#

