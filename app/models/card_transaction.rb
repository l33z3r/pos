class CardTransaction < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :order
end




# == Schema Information
#
# Table name: card_transactions
#
#  id               :integer(8)      not null, primary key
#  order_id         :integer(8)
#  payment_method   :string(255)
#  amount           :float
#  created_at       :datetime
#  updated_at       :datetime
#  reference_number :string(255)
#  outlet_id        :integer(8)
#

