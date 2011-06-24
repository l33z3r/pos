# == Schema Information
# Schema version: 20110616065837
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
#

class CashTotal < ActiveRecord::Base
  #the start and end order ids tell us how the calculation was arrived at
  belongs_to :start_order, :class_name => "Order", :foreign_key => "start_calc_order_id"
  belongs_to :end_order, :class_name => "Order", :foreign_key => "end_calc_order_id"
  
  belongs_to :employee
  
  validates :employee_id, :presence => true
  
  X_TOTAL = "X"
  Z_TOTAL = "Z"
  VALID_TOTAL_TYPES = [X_TOTAL, Z_TOTAL]
  
  validates :total_type, :presence => true, :inclusion => { :in => VALID_TOTAL_TYPES }
  
  def self.do_total total_type, employee, terminal_id
    #validate total_type
    return nil unless VALID_TOTAL_TYPES.include?(total_type)
    
    @cash_total, @cash_total_data = CashTotal.prepare_cash_total_data terminal_id
    
    @cash_total_data[:business_info_data] = {}
    @cash_total_data[:business_info_data]["Terminal:"] = terminal_id
    @cash_total_data[:business_info_data]["X/Z Report Number:"] = "Some Number"
    @cash_total_data[:business_info_data]["Date:"] = Time.now.to_s(:short)
    @cash_total_data[:business_info_data]["User"] = employee.nickname
    
    #insert a row
    @cash_total = CashTotal.new({:employee_id => employee.id, :terminal_id => terminal_id,
        :start_order => @first_order, :end_order => @last_order, :total_type => total_type, :total => @overall_total})
    @cash_total.save!
        
    return @cash_total, @cash_total_data
  end
  
  def self.prepare_cash_total_data terminal_id
    @sales_by_category = {}
    @sales_by_server = {}
    @sales_by_payment_type = {}
    @taxes = {}
        
    @cash_total_data = {}
    
    #load the first order, based on the last z total or the very first if none exists
    @last_performed_z_total = find(:last, :conditions => "total_type = '#{Z_TOTAL}' and end_calc_order_id is not null and terminal_id = '#{terminal_id}'", :order => "created_at")
    
    if @last_performed_z_total
      #now load the next order after the end order from the previous z total
      @first_order = Order.find(:first, 
        :conditions => "created_at > '#{@last_performed_z_total.end_order.created_at}' and terminal_id = '#{terminal_id}'", 
        :order => "created_at")
    else
      #no z totals yet, so just grab orders
      @first_order = Order.find(:first, :conditions => "terminal_id = '#{terminal_id}'", :order => "created_at")
    end
      
    if !@first_order
      @overall_total = 0
    else
      #load the most recent order
      @last_order = Order.find(:last, :conditions => "terminal_id = '#{terminal_id}'", :order => "created_at")

      #do the calculation
      @overall_total = 0
        
      #here are all the orders for this terminal since the last z total
      @orders = Order.find(:all, 
        :conditions => "created_at >= '#{@first_order.created_at}' and created_at <= '#{@last_order.created_at}' and terminal_id = '#{terminal_id}'")
        
      @orders.each do |order|
        order.order_items.each do |order_item|
            
          @category_name = order_item.product.category.name
            
          #sales by category
          if !@sales_by_category[@category_name]
            @sales_by_category[@category_name] = 0
          end
            
          logger.info "Increasing sales_by_category for category: #{@category_name} for product: #{order_item.product.name} by: #{order_item.total_price}"
          @order_item_price = order_item.total_price
            
          #take away the whole order discount
          if order.discount_percent and order.discount_percent > 0
            @order_item_price -= ((order.discount_percent * @order_item_price)/100)
          end
          
          #now if tax chargable, add it on
          @tax_chargable = GlobalSetting.parsed_setting_for GlobalSetting::TAX_CHARGABLE
          @global_tax_rate = GlobalSetting.parsed_setting_for GlobalSetting::GLOBAL_TAX_RATE
            
          if @tax_chargable
            @order_item_price += ((@global_tax_rate * @order_item_price)/100)
          end
          
          @sales_by_category[@category_name] += @order_item_price
          
          @tax_rate = order_item.tax_rate
          
          #if tax rate on an item is -1 then tax was not chargable for that transaction
          if @tax_rate == -1
            #use the global tax rate
            @tax_rate = @global_tax_rate
          end
            
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
            
        end
          
        #sales by server
        @server_nickname = order.employee.nickname
            
        if !@sales_by_server[@server_nickname]
          @sales_by_server[@server_nickname] = 0
        end
            
        logger.info "Increasing sales_by_server for server: #{@server_name} by: #{order.total}"
        @sales_by_server[@server_nickname] += order.total 
          
        #sales by payment type
        @payment_type = order.payment_type
            
        if !@sales_by_payment_type[@payment_type]
          @sales_by_payment_type[@payment_type] = 0
        end
            
        logger.info "Increasing sales_by_payment_type for payment_type: #{@payment_type} by: #{order.total}"
        @sales_by_payment_type[@payment_type] += order.total 
          
          
          
          
          
        #TODO: cash paid out
          
          
        #TODO: cash paid out
          
          
        #overall total
        @overall_total += order.total
      end
        
    end
    
    @cash_total_data[:sales_by_category] = @sales_by_category
    @cash_total_data[:sales_by_server] = @sales_by_server
    @cash_total_data[:sales_by_payment_type] = @sales_by_payment_type
    @cash_total_data[:taxes] = @taxes
    
    return @overall_total, @cash_total_data
  end
  
end
