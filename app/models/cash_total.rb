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
    
    #insert a row based on a calculation involving 
    #the most recent order and the last z total
    
    #load the first order, based on the last z total or the very first if none exists
    @last_performed_z_total = find(:last, :conditions => "total_type = '#{Z_TOTAL}' and end_calc_order_id is not null", :order => "created_at")
    
    if @last_performed_z_total
      #now load the next order after the end order from the previous z total
      @first_order = Order.find(:first, 
        :conditions => "created_at > '#{@last_performed_z_total.end_order.created_at}'", 
        :order => "created_at")
    else
      #no z totals yet, so just grab orders
      @first_order = Order.find(:first, :order => "created_at")
    end
      
    if !@first_order
      @total = 0
    else
      #load the most recent order
      @last_order = Order.find(:last, :order => "created_at")
      
      if @first_order.id == @last_order.id
        #only one order in db
        @total = @first_order.total
      else
        #do the calculation
        @total = 0
        
        @orders = Order.find(:all, 
          :conditions => "created_at >= '#{@first_order.created_at}' and created_at <= '#{@last_order.created_at}'")
        
        @orders.each do |order|
          @total += order.total
        end
      end
    end
    
    #insert a row
    @cash_total = CashTotal.new({:employee_id => employee.id, :terminal_id => terminal_id,
        :start_order => @first_order, :end_order => @last_order, :total_type => total_type, :total => @total})
    @cash_total.save!
      
    return @cash_total
  end
  
end
