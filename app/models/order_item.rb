class OrderItem < ActiveRecord::Base
  belongs_to :outlet
  
  serialize :oia_data
  
  belongs_to :order
  belongs_to :employee
  
  has_one :void_employee, :class_name => "Employee", :foreign_key => "void_employee_id"
  
  belongs_to :product

  has_many :stock_transactions
  
  def week
    self.created_at.strftime('%W')
  end

  def day
    self.created_at.strftime('%d')
  end

  def year
    self.created_at.strftime('%y')
  end

  def month
    self.created_at.strftime('%m')
  end

  def best_sellers
    self.total
  end


end










# == Schema Information
#
# Table name: order_items
#
#  id                     :integer(8)      not null, primary key
#  order_id               :integer(8)
#  employee_id            :integer(8)
#  product_id             :integer(8)
#  quantity               :float
#  total_price            :float
#  created_at             :datetime
#  updated_at             :datetime
#  modifier_name          :string(255)
#  modifier_price         :float
#  discount_percent       :float
#  pre_discount_price     :float
#  tax_rate               :float
#  terminal_id            :string(255)
#  time_added             :string(255)
#  show_server_added_text :boolean(1)      default(FALSE)
#  product_name           :string(255)
#  is_double              :boolean(1)      default(FALSE)
#  oia_data               :text(2147483647
#  is_void                :boolean(1)      default(FALSE)
#  is_half                :boolean(1)      default(FALSE)
#  void_employee_id       :integer(8)
#  outlet_id              :integer(8)
#

