class CashTotalDataMigrate < ActiveRecord::Migration
  def self.up
    #when we added the loyalty system, the old cash totals had no loyalty info
    CashTotal.where("total_type = '#{CashTotal::X_TOTAL}' or total_type = '#{CashTotal::Z_TOTAL}'").each do |ct|
      if !ct.report_data[:open_orders_total]
        ct.report_data[:open_orders_total] = 0
        ct.save
      end
      
      if !ct.report_data[:cash_outs]
        ct.report_data[:cash_outs] = []
        ct.save
      end
      
      if !ct.report_data[:amount_customer_payments_received]
        ct.report_data[:amount_customer_payments_received] = 0
        ct.save
      end
    end
  end

  def self.down
  end
end
