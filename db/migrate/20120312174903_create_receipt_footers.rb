class CreateReceiptFooters < ActiveRecord::Migration
  def self.up
    create_table :receipt_footers do |t|
      t.string :name      
      t.string :content
    end
    
    add_column :payment_methods, :receipt_footer_id, :integer
  end

  def self.down
    drop_table :receipt_footers
    
    remove_column :payment_methods, :receipt_footer_id
  end
end
