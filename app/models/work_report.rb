class WorkReport < ActiveRecord::Base
  belongs_to :employee
  
  serialize :report_data
  
  RS_TOTAL_ITEMS_ORDERED = 1
  RS_TOTAL_ITEMS_SOLD = 2
  RS_VOIDED_ITEMS_QUANTITY = 3
  RS_VOIDED_ITEMS_AMOUNT = 4
  RS_TOTAL_ORDERS_AMOUNT = 5
  RS_DISCOUNTS_GIVEN = 6
  RS_AVG_ORDER_PRICE = 7
  RS_AVG_SALE_PRICE = 8
  RS_TOTAL_CASH_ENTERED = 9
  RS_TOTAL_PAYMENTS_ENTERED = 10
  
  REPORT_SECTIONS = [
    RS_TOTAL_ITEMS_ORDERED, RS_TOTAL_ITEMS_SOLD, RS_VOIDED_ITEMS_QUANTITY, RS_VOIDED_ITEMS_AMOUNT, 
    RS_TOTAL_ORDERS_AMOUNT, RS_DISCOUNTS_GIVEN, RS_AVG_ORDER_PRICE, RS_AVG_SALE_PRICE, 
    RS_TOTAL_CASH_ENTERED, RS_TOTAL_PAYMENTS_ENTERED
  ]
  
  def self.report_sections 
    REPORT_SECTIONS
  end
  
  def self.report_section_name rs
    WorkReport.constants.each do |constant_name|
      if rs.to_s == eval(constant_name.to_s).to_s
        return constant_name.to_s[2..constant_name.to_s.length].humanize.titleize
      end
    end
    
    return ""
  end
  
end


# == Schema Information
#
# Table name: work_reports
#
#  id              :integer(4)      not null, primary key
#  employee_id     :integer(4)
#  report_data     :text
#  created_at      :datetime
#  updated_at      :datetime
#  clockin_time    :datetime
#  clockout_time   :datetime
#  shift_seconds   :integer(4)      default(0)
#  break_seconds   :integer(4)      default(0)
#  payable_seconds :integer(4)      default(0)
#  hourly_rate     :float
#  cost            :float
#

