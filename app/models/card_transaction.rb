class CardTransaction < ActiveRecord::Base
  belongs_to :order
end

# == Schema Information
#
# Table name: card_transactions
#
#  id             :integer(4)      not null, primary key
#  order_id       :integer(4)
#  payment_method :string(255)
#  amount         :float
#  created_at     :datetime
#  updated_at     :datetime
#

