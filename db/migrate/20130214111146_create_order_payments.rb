class CreateOrderPayments < ActiveRecord::Migration
  def self.up    
    create_table :order_payments do |t|
      t.integer :order_id
      t.float :amount
      t.string :payment_method
      t.integer :outlet_id
      t.timestamps
    end    
    
    execute("ALTER TABLE order_payments MODIFY column id BIGINT")
    execute("ALTER TABLE order_payments MODIFY column order_id BIGINT")
    execute("ALTER TABLE order_payments MODIFY column outlet_id BIGINT")
    
    #build for existing orders
    Order.all.each do |o|
      puts o.id
      @sp = o.split_payments
      
      #make sure its not empty
      if @sp.is_a? Hash
        @sp.each do |payment_method, amount|
          @op = OrderPayment.new
          @op.outlet_id = o.outlet_id
          @op.order_id = o.id
          @op.payment_method = payment_method
          @op.amount = amount
          @op.save!
        end
      end
    end
  end

  def self.down
    drop_table :order_payments
  end
end
