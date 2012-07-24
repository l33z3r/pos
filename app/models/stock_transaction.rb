class StockTransaction < ActiveRecord::Base
  belongs_to :product
  belongs_to :employee
  belongs_to :order_item

  STOCK_UPDATE = 1
  STOCK_TRANSFER = 2
  DELIVERY = 3
  STOCK_TAKE = 4
  SALE = 5
  
  VALID_TRANSACTION_TYPES = [STOCK_UPDATE, STOCK_TRANSFER, DELIVERY, STOCK_TAKE, SALE]
  
  validates :product_id, :numericality => true, :presence => true
  validates :employee_id, :numericality => true, :presence => true
  validates :transaction_type, :numericality => true, :inclusion => { :in => VALID_TRANSACTION_TYPES }
  validates :old_amount, :numericality => true, :presence => true
  validates :change_amount, :numericality => true, :presence => true
  
  def type_text
    case transaction_type
    when STOCK_UPDATE
      "Update Stock"
    when STOCK_TRANSFER
      "Transfer Stock"
    when DELIVERY
      "Delivery"
    when STOCK_TAKE
      "Stock Take"
    when SALE
      "Sale"
    end
  end
end





# == Schema Information
#
# Table name: stock_transactions
#
#  id               :integer(4)      not null, primary key
#  product_id       :integer(4)
#  employee_id      :integer(4)
#  old_amount       :float
#  change_amount    :float
#  transaction_type :integer(4)
#  note             :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#  delivery_id      :integer(4)
#  is_return        :boolean(1)      default(FALSE)
#

