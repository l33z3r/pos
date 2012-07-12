class OrderDataMigrate < ActiveRecord::Migration
  def self.up
    #when we added the employee id who voided an item, the old order items did not have this info
    execute("update order_items set void_employee_id = employee_id where void_employee_id is null")
    
    #when we added the loyalty system, the old cash totals had no loyalty info
    CashTotal.where("total_type = '#{CashTotal::X_TOTAL}' or total_type = '#{CashTotal::Z_TOTAL}'").each do |ct|
      if !ct.report_data[:loyalty_redeemed]
        ct.report_data[:loyalty_redeemed] = 0
        ct.save
      end
    end
  end

  def self.down
    #ignore
  end
end
