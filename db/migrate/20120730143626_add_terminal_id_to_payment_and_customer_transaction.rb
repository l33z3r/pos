class AddTerminalIdToPaymentAndCustomerTransaction < ActiveRecord::Migration
  def self.up
    add_column :payments, :terminal_id, :string
    add_column :customer_transactions, :terminal_id, :string
    
    @some_terminal = GlobalSetting.all_terminals.first
    
    CustomerTransaction.all.each do |ct|
      if ct.order
        ct.terminal_id = ct.order.terminal_id
      elsif ct.payment
        ct.terminal_id = ct.payment.terminal_id = @some_terminal
      end
      
      ct.save
    end
  end

  def self.down
    remove_column :payments, :terminal_id
    remove_column :customer_transactions, :terminal_id
  end
end
