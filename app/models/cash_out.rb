class CashOut < ActiveRecord::Base
end

# == Schema Information
#
# Table name: cash_outs
#
#  id          :integer(4)      not null, primary key
#  terminal_id :string(255)
#  note        :string(255)
#  amount      :float
#  created_at  :datetime
#  updated_at  :datetime
#

