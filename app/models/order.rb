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
# The total will be calculated as above, just without calculating any tax. And no tax is added to the total
#
# Service charge and cashback are stored in sepreate columns to total
#
#
# Remember that products can be stored as order_item_additions and will not have a line in order_item to represent the sale of that item
#
#
# VOIDS:
# The is_void column in the order model is used when the order is replaced by another one. 
# The void_order_id of the order that replaced it points back to the original order that is marked as is_void.
# This is_void on order model is not used when you void items on the till roll. 
# There is an is_void on the order_item that is used for this purpose. 
# If all items are voided on an order, the is_void column will still be true, unless that order is reopened and replaced by another. 
# Basically, the is_void in here is not used for voided items, but for re-opened ones.
# 
#


class Order < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :order_items
  belongs_to :employee
  belongs_to :table_info

  serialize :split_payments
  
  #point to original order
  belongs_to :void_order, :class_name => "Order"
  
  #point to replacement order
  has_one :replacement_order, :class_name => "Order", :foreign_key => "void_order_id"
  
  has_one :client_transaction
  has_one :customer_transaction
  has_one :customer_points_allocation
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 15
  
  def total_including_cashback_and_service_charge
    total + cashback + service_charge
  end
  
  def self.next_order_num current_outlet
    GlobalSetting.next_order_number current_outlet
  end
  
  def is_replacement?
    void_order != nil
  end
end





# == Schema Information
#
# Table name: orders
#
#  id                    :integer(4)      not null, primary key
#  employee_id           :integer(4)
#  total                 :float
#  payment_type          :string(255)
#  amount_tendered       :float
#  is_table_order        :boolean(1)      default(FALSE)
#  num_persons           :integer(4)
#  created_at            :datetime
#  updated_at            :datetime
#  table_info_id         :integer(4)
#  discount_percent      :float
#  pre_discount_price    :float
#  terminal_id           :string(255)
#  table_info_label      :string(255)
#  tax_chargable         :boolean(1)      default(FALSE)
#  global_sales_tax_rate :float
#  service_charge        :float
#  cashback              :float
#  void_order_id         :integer(4)
#  is_void               :boolean(1)      default(FALSE)
#  order_num             :integer(8)
#  split_payments        :text(2147483647
#  client_name           :string(255)     default(""), not null
#  time_started          :string(255)
#  training_mode_sale    :boolean(1)      default(FALSE)
#  room_id               :integer(4)
#  outlet_id             :integer(4)
#

