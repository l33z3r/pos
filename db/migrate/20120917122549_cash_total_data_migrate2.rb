class CashTotalDataMigrate2 < ActiveRecord::Migration
  def self.up
    #when we added the loyalty system, the old cash totals had no loyalty info
    CashTotal.where("total_type = '#{CashTotal::X_TOTAL}' or total_type = '#{CashTotal::Z_TOTAL}'").each do |ct|
      if !ct.report_data[:refunds_by_employee]
        ct.report_data[:refunds_by_employee] = {}
        ct.save
      end
      
      if !ct.report_data[:refunds_by_product]
        ct.report_data[:refunds_by_product] = {}
        ct.save
      end
      
      if !ct.report_data[:total_refunds]
        ct.report_data[:total_refunds] = 0
        ct.save
      end
    end
  end

  def self.down
  end
end
