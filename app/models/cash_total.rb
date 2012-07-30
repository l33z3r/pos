# == Schema Information
# Schema version: 20110705150431
#
# Table name: cash_totals
#
#  id                  :integer(4)      not null, primary key
#  total_type          :string(255)
#  total               :float
#  start_calc_order_id :integer(4)
#  end_calc_order_id   :integer(4)
#  created_at          :datetime
#  updated_at          :datetime
#  employee_id         :integer(4)
#  terminal_id         :string(255)
#  report_num          :integer(4)
#  report_data         :text
#

# Notes on Cash Totals:
# Voided items and orders do not count toward totals
# Totals by product may not add up as the prices may have changed for a product over the course of a working day
# 
# Loyalty Points do not count towards VAT
# 

class CashTotal < ActiveRecord::Base
  
  serialize :report_data
  
  #the start and end order ids tell us how the calculation was arrived at
  belongs_to :start_order, :class_name => "Order", :foreign_key => "start_calc_order_id"
  belongs_to :end_order, :class_name => "Order", :foreign_key => "end_calc_order_id"
  
  belongs_to :employee
  
  validates :employee_id, :presence => true
  
  X_TOTAL = "X"
  Z_TOTAL = "Z"
  FLOAT = "F"
  VALID_TOTAL_TYPES = [X_TOTAL, Z_TOTAL, FLOAT]
  
  RS_SALES_BY_DEPARTMENT = 1
  RS_SALES_BY_PAYMENT_TYPE = 2
  RS_CASH_SUMMARY = 3
  RS_SALES_BY_SERVER = 4
  RS_CASH_PAID_OUT = 5
  RS_SALES_TAX_SUMMARY = 6
  RS_SALES_BY_CATEGORY = 7
  RS_SALES_BY_PRODUCT = 8
  RS_SERVICE_CHARGE_BY_PAYMENT_TYPE = 9
  RS_VOIDS_BY_EMPLOYEE = 10
  RS_CASH_OUT = 11
  
  REPORT_SECTIONS = [
    RS_SALES_BY_DEPARTMENT, RS_SALES_BY_PAYMENT_TYPE, RS_CASH_SUMMARY, RS_SALES_BY_SERVER, 
    RS_CASH_PAID_OUT, RS_SALES_TAX_SUMMARY, RS_SALES_BY_CATEGORY, RS_SALES_BY_PRODUCT,
    RS_SERVICE_CHARGE_BY_PAYMENT_TYPE, RS_VOIDS_BY_EMPLOYEE, RS_CASH_OUT
  ]
  
  validates :total_type, :presence => true, :inclusion => { :in => VALID_TOTAL_TYPES }
  
  def self.do_total total_type, commit, cash_count, open_orders_total, employee, terminal_id
    CashTotal.transaction do
      #validate total_type
      return nil unless VALID_TOTAL_TYPES.include?(total_type)
    
      @cash_total, @cash_total_data = CashTotal.prepare_cash_total_data terminal_id, cash_count, open_orders_total
    
      #prepare the next report sequence number
      @next_report_num = CashTotal.get_next_report_number terminal_id, total_type
      
      @cash_total_data[:business_info_data] = {}
      @cash_total_data[:business_info_data]["#{total_type} Report Number:"] = @next_report_num
      @cash_total_data[:business_info_data]["Terminal:"] = terminal_id
      @cash_total_data[:business_info_data]["Date:"] = Time.now.strftime(GlobalSetting.default_date_format)
      @cash_total_data[:business_info_data]["Performed By:"] = employee.nickname
    
      #insert a row if commit is true
      if commit
        @cash_total_obj = CashTotal.new({:employee_id => employee.id, :terminal_id => terminal_id, :report_num => @next_report_num,
            :report_data => @cash_total_data, :start_order => @first_order, :end_order => @last_order, :total_type => total_type, :total => @overall_total})
        @cash_total_obj.save!
      end
    
      return @cash_total_obj, @cash_total, @cash_total_data
    end
  end
  
  def self.prepare_cash_total_data terminal_id, cash_count, open_orders_total
    @sales_by_product = {}
    @sales_by_category = {}
    @sales_by_department = {}
    @sales_by_server = {}
    @sales_by_payment_type = {}
    @voids_by_employee = {}
    @service_charge_by_payment_type = {}
    @cash_summary = {}
    @taxes = {}
        
    @cash_total_data = {}
    
    @cash_sales_total = 0
    @cash_back_total = 0
       
    @total_discounts = 0
    @total_covers = 0
    @loyalty_points_redeemed = 0
    
    #load the first order, based on the last z total or the very first if none exists
    @last_performed_non_zero_z_total = where("total_type = ?", Z_TOTAL).where("end_calc_order_id is not ?", nil).where("terminal_id = ?", terminal_id).order("created_at").lock(true).last
    
    if @last_performed_non_zero_z_total
      #now load the next order after the end order from the previous z total
      @first_order = Order.where("created_at > ?", @last_performed_non_zero_z_total.end_order.created_at).where("terminal_id = ?", terminal_id).order("created_at").lock(true).first
    else
      #no z totals yet, so just grab orders
      @first_order = Order.where("terminal_id = ?", terminal_id).order("created_at").lock(true).first
    end
      
    if !@first_order
      @overall_total = 0
      @service_charge_total = 0
    else
      #load the most recent order
      @last_order = Order.where("terminal_id = ?", terminal_id).order("created_at").lock(true).last

      #do the calculation
      @overall_total = 0
      @service_charge_total = 0
        
      #here are all the orders for this terminal since the last z total
      @orders = Order.where("created_at >= ?", @first_order.created_at).where("created_at <= ?", @last_order.created_at).where("terminal_id = ?", terminal_id).where("training_mode_sale is false").where("is_void is false").lock(true)
       
      @orders.each do |order|
        
        @server_nickname = order.employee.nickname
        
        order.order_items.each do |order_item|
            
          #the @order_item_price variable will be the total price for that item 
          #including discounts at both the order level and the order item level
          @order_item_price = order_item.total_price
          
          #take away the whole order discount
          if order.discount_percent and order.discount_percent > 0
            @order_item_price -= ((order.discount_percent * @order_item_price)/100)
          end
          
          if order_item.is_void
            
            @void_employee = Employee.find_by_id(order_item.void_employee_id)
            @void_employee_nickname = @void_employee.nickname
            
            #initialise a hash for employee
            if !@voids_by_employee[@void_employee_nickname]
              @voids_by_employee[@void_employee_nickname] = {
                :quantity => 0,
                :sales_total => 0
              }
            end
          
            @product_voids_quantity = @voids_by_employee[@void_employee_nickname][:quantity].to_f
            @product_voids_quantity += order_item.quantity
            @product_voids_quantity = sprintf("%g", @product_voids_quantity)
            @voids_by_employee[@void_employee_nickname][:quantity] = @product_voids_quantity
          
            @voids_by_employee[@void_employee_nickname][:sales_total] += @order_item_price
          
            #now continue to next product so this one does not get included in sales totals
            next
          end
          
          @product_name = order_item.product.name
          
          #sales by product
          if !@sales_by_product[@product_name]
            @sales_by_product[@product_name] = {
              :quantity => 0,
              :sales_total => 0
            }
          end
          
          if order_item.product.category
            @category_name = order_item.product.category.name
          else 
            @category_name = "None"
          end
            
          #sales by category
          if !@sales_by_category[@category_name]
            @sales_by_category[@category_name] = 0
          end
            
          if order_item.product.category and order_item.product.category.parent_category
            @department_name = order_item.product.category.parent_category.name
          else 
            @department_name = "None"
          end
            
          #sales by department
          if !@sales_by_department[@department_name]
            @sales_by_department[@department_name] = 0
          end
            
          #now if tax chargable, add it on
          @tax_chargable = GlobalSetting.parsed_setting_for GlobalSetting::TAX_CHARGABLE
          @global_tax_rate = GlobalSetting.parsed_setting_for GlobalSetting::GLOBAL_TAX_RATE
            
          @product_sales_quantity = @sales_by_product[@product_name][:quantity].to_f
          @product_sales_quantity += order_item.quantity
          @product_sales_quantity = sprintf("%g", @product_sales_quantity)
          @sales_by_product[@product_name][:quantity] = @product_sales_quantity
          
          @sales_by_product[@product_name][:sales_total] += @order_item_price
          
          @sales_by_category[@category_name] += @order_item_price
          @sales_by_department[@department_name] += @order_item_price
          
          if order_item.pre_discount_price
            @order_item_price_including_item_discount = order_item.pre_discount_price
            @order_item_total_discount = order_item.pre_discount_price - order_item.total_price
          else 
            @order_item_price_including_item_discount = order_item.total_price
            @order_item_total_discount = 0
          end
          
          #add on whole order discount
          if order.discount_percent and order.discount_percent > 0
            @order_item_total_discount += (order.discount_percent * @order_item_price_including_item_discount)/100
          end
          
          @total_discounts += @order_item_total_discount
            
          if @tax_chargable
            @tax_rate = @global_tax_rate
            
            @tax_rate_key = @tax_rate.to_s
              
            if !@taxes[@tax_rate_key]
              @taxes[@tax_rate_key] = {:net => 0, :tax => 0, :gross => 0}
            end
              
            @order_item_tax = (@tax_rate.to_f * @order_item_price.to_f)/100
            @order_item_price_before_tax = @order_item_price.to_f - @order_item_tax
            @order_item_gross = @order_item_price
              
            @taxes[@tax_rate_key][:net] += @order_item_price_before_tax
            @taxes[@tax_rate_key][:tax] += @order_item_tax
            @taxes[@tax_rate_key][:gross] += @order_item_gross
            
          else
            @tax_rate = order_item.tax_rate
          
            @tax_rate_key = @tax_rate.to_s
              
            if !@taxes[@tax_rate_key]
              @taxes[@tax_rate_key] = {:net => 0, :tax => 0, :gross => 0}
            end

            @order_item_tax = @order_item_price.to_f - (@order_item_price.to_f/(1 + (@tax_rate.to_f/100)))
            @order_item_price_before_tax = @order_item_price.to_f - @order_item_tax
            @order_item_gross = @order_item_price
              
            @taxes[@tax_rate_key][:net] += @order_item_price_before_tax
            @taxes[@tax_rate_key][:tax] += @order_item_tax
            @taxes[@tax_rate_key][:gross] += @order_item_gross
          end
            
        end
          
        if !@sales_by_server[@server_nickname]
          @sales_by_server[@server_nickname] = 0
        end
            
        logger.info "Increasing sales_by_server for server: #{@server_name} by: #{order.total}"
        @sales_by_server[@server_nickname] += order.total
        
        #increase covers 
        @total_covers += order.num_persons
        
        #sales by payment type calculated from split payments array
        @payment_types = order.split_payments
        
        if @payment_types and @payment_types.length > 0
          @payment_types.each do |pt, amount|
            amount = amount.to_f
            
            pt = pt.downcase
           
            #if the amount tendered was bigger than the total, we have to subtract from the cash payment for reporting
            if pt == PaymentMethod::CASH_PAYMENT_METHOD_NAME and order.amount_tendered > order.total
              amount -= (order.amount_tendered - (order.total + order.service_charge))
            end
          
            if !@sales_by_payment_type[pt]
              @sales_by_payment_type[pt] = 0
            end
          
            logger.info "Increasing sales_by_payment_type for payment_type: #{pt} by: #{amount}"
            @sales_by_payment_type[pt] += amount
          end
          
          @first_pt = @payment_types.keys[0].downcase
          
          if !@service_charge_by_payment_type[@first_pt]
            @service_charge_by_payment_type[@first_pt] = 0
          end
        
          logger.info "Increasing service_charge_by_payment_type for payment_type: #{@first_pt} by: #{order.service_charge} #{@sales_by_payment_type[@first_pt]} #{@cash_sales_total}"
          @service_charge_by_payment_type[@first_pt] += order.service_charge
          
          #now deduct that service charge from that payment types entry in @sales_by_payment_type
          if !@sales_by_payment_type[@first_pt]
            @sales_by_payment_type[@first_pt] = 0
          end
        
          @sales_by_payment_type[@first_pt] -= order.service_charge
        end
        
        #overall total
        @overall_total += order.total
        
        @service_charge_total += order.service_charge
      end
    
      #get all the settled account amounts
      @customer_settlements_amount = 0
    
      @customer_txns = CustomerTransaction.where("transaction_type = ?", CustomerTransaction::SETTLEMENT)
      .where("terminal_id = ?", terminal_id)
      .where("created_at >= ?", @last_performed_non_zero_z_total.created_at)
      .where("created_at <= ?", Time.now)
    
      @customer_txns.all.each do |ct|
        @transaction_amount = ct.actual_amount
        @transaction_payment_type = ct.payment.payment_method.downcase
      
        #if the amount tendered was bigger than the total, we have to subtract from the cash payment for reporting
        if @transaction_payment_type == PaymentMethod::CASH_PAYMENT_METHOD_NAME and ct.payment.amount_tendered > ct.payment.amount
          @transaction_amount -= (ct.payment.amount_tendered - ct.payment.amount)
        end
          
        @customer_settlements_amount += @transaction_amount
      
        if !@sales_by_payment_type[@transaction_payment_type]
          @sales_by_payment_type[@transaction_payment_type] = 0
        end
            
        @sales_by_payment_type[@transaction_payment_type] += @transaction_amount
      end
        
      #total of all cash sales (including the service charge)
      @cash_sales_total += @sales_by_payment_type[PaymentMethod::CASH_PAYMENT_METHOD_NAME] if @sales_by_payment_type[PaymentMethod::CASH_PAYMENT_METHOD_NAME]
      
      #total of all loyalty points redeemed (including the service charge)
      @loyalty_points_redeemed += @sales_by_payment_type[PaymentMethod::LOYALTY_PAYMENT_METHOD_NAME] if @sales_by_payment_type[PaymentMethod::LOYALTY_PAYMENT_METHOD_NAME]
      
      #total of all cash back
      @cash_back_total += Order.where("created_at >= ?", @first_order.created_at)
      .where("created_at <= ?", @last_order.created_at)
      .where("is_void is false")
      .where("terminal_id = ?", terminal_id).lock(true).sum("cashback")
    end
        
    @opening_float = CashTotal.current_float_amount terminal_id
    
    @cash_paid_out = 0
    
    @cash_outs = CashOut.where("terminal_id = ?", terminal_id)
    .where("created_at >= ?", @last_performed_non_zero_z_total.created_at)
    .where("created_at <= ?", Time.now)
    
    @serialized_cash_outs = []
    
    @cash_outs.all.each do |co|
      @cash_paid_out += co.amount
      @serialized_cash_outs << {:description => co.note, :amount => co.amount}
    end
    
    @over_runs = 0
        
    @total_cash = (@opening_float + @cash_sales_total) - @cash_paid_out - @cash_back_total - @over_runs
        
    @shortfall = @total_cash - cash_count
        
    #TODO: cash paid out
    @cash_summary["Opening Float"] = @opening_float
    @cash_summary["Cash Sales"] = @cash_sales_total
    @cash_summary["Expenses"] = -1 * @cash_paid_out
    @cash_summary["Cashback"] = @cash_back_total
    #@cash_summary["Over-runs"] = @over_runs
    @cash_summary["Total Cash"] = @total_cash
    @cash_summary["Cash In Drawer"] = cash_count
    @cash_summary["Shortfall"] = @shortfall
          
    #sort sales_by_product alphabetically
    @sales_by_product = @sales_by_product.sort
    @cash_total_data[:sales_by_product] = @sales_by_product
    
    #sort voids_by_employee alphabetically
    @voids_by_employee = @voids_by_employee.sort
    @cash_total_data[:voids_by_employee] = @voids_by_employee
    
    @cash_total_data[:sales_by_category] = @sales_by_category
    
    #put the discounts in as the last item in sales by department
    @sales_by_department["Discounts"] = @total_discounts
    
    @cash_total_data[:sales_by_department] = @sales_by_department
    @cash_total_data[:sales_by_server] = @sales_by_server
    @cash_total_data[:sales_by_payment_type] = @sales_by_payment_type
    @cash_total_data[:service_charge_by_payment_type] = @service_charge_by_payment_type
    @cash_total_data[:service_charge_total] = @service_charge_total
    @cash_total_data[:total_with_service_charge] = @service_charge_total + @overall_total
    @cash_total_data[:total_discounts] = @total_discounts
    @cash_total_data[:loyalty_redeemed] = @loyalty_points_redeemed
    @cash_total_data[:taxes] = @taxes
    @cash_total_data[:total_covers] = @total_covers
    @cash_total_data[:cash_summary] = @cash_summary
    @cash_total_data[:cash_outs] = @serialized_cash_outs
    @cash_total_data[:open_orders_total] = open_orders_total
    
    @cash_total_data[:amount_customer_payments_received] = @customer_settlements_amount
    
    return @overall_total, @cash_total_data
  end
  
  def self.get_next_report_number terminal_id, total_type
    @next_report_num = 1
    
    @last_report_for_type = where("total_type = ?", total_type).where("terminal_id = ?", terminal_id).order("created_at").lock(true).last
    
    if @last_report_for_type
      @next_report_num = @last_report_for_type.report_num + 1
    end
    
    @next_report_num
  end
  
  def self.do_add_float employee, terminal_id, float_amount
    @cash_total_obj = CashTotal.new({:employee_id => employee.id, :terminal_id => terminal_id,
        :total_type => FLOAT, :total => float_amount})
    @cash_total_obj.save
  end
  
  def self.last_z_total terminal_id
    where("total_type = ?", Z_TOTAL).where("terminal_id = ?", terminal_id).order("created_at").last
  end

  def self.current_float_amount terminal_id
    @last_z_total, @previous_floats = CashTotal.floats_since_last_z_total terminal_id
    
    @sum = @previous_floats.sum("total")
    
    @sum
  end
  
  def self.floats_since_last_z_total terminal_id
    @last_z_total = CashTotal.last_z_total terminal_id
    
    #select all previous floats since last z total
    @previous_floats = where("total_type = ?", CashTotal::FLOAT).where("terminal_id = ?", terminal_id)
    
    if @last_z_total
      @previous_floats = @previous_floats.where("created_at >= ?", @last_z_total.created_at)
    end
    
    @previous_floats = @previous_floats.order("created_at desc")
    
    return @last_z_total, @previous_floats
  end
  
  def self.all_cash_totals total_type, terminal_id
    where("total_type = ?", total_type).where("terminal_id = ?", terminal_id).order("created_at desc")
  end
  
  def self.report_sections 
    REPORT_SECTIONS
  end
  
  def self.report_section_name rs
    CashTotal.constants.each do |constant_name|
      if rs.to_s == eval(constant_name.to_s).to_s
        return constant_name.to_s[2..constant_name.to_s.length].humanize.titleize
      end
    end
    
    return ""
  end

  def self.types
    return VALID_TOTAL_TYPES
  end

end
