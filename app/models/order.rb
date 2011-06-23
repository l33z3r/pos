# == Schema Information
# Schema version: 20110623063424
#
# Table name: orders
#
#  id                    :integer(4)      not null, primary key
#  employee_id           :integer(4)
#  total                 :float
#  payment_type          :string(255)
#  amount_tendered       :integer(4)
#  is_table_order        :boolean(1)
#  num_persons           :integer(4)
#  created_at            :datetime
#  updated_at            :datetime
#  table_info_id         :integer(4)
#  discount_percent      :float
#  pre_discount_price    :float
#  terminal_id           :string(255)
#  table_info_label      :string(255)
#  tax_chargable         :boolean(1)
#  global_sales_tax_rate :float
#  service_charge        :float
#  cashback              :float
#

# Tax can either be chargable or not in the system. 
# 
# If it is chargable, the flag in order will be set and the global tax rate will be picked up from
# global settings and stored with the order. At the same time, the tax rate for each order item will be set to -1. 
# The total will be the sum of the total_price field for each order item 
# (which includes the modifier prices and dicounts applied to order items) and then the overall discount will 
# be applied to the order if there is one. Tax is then calculated on that number. Service charge is not stored with the order total, 
# make sure to take this into account when finding out how to work out change from cash tendered if there was a tip.
# The total field actually contains the ((items discounted sumed) and whole order discount applied) + (tax based on above)
#
# If tax is not chargable the tax rates will be set individually on the order items based on the tax rates that have 
# been applied to them in the system settings. The tax_chargable flag in order will be false and the global_sales_tax_rate here will be -1.
# The total will be calculated as above, just without calculating any tax. And no tax is added to the subtotal
#
# Service charge and cashback are stored in sepreate columns to total
#

class Order < ActiveRecord::Base
  has_many :order_items
  belongs_to :employee
  belongs_to :table_info
end
