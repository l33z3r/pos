class CreatePaymentMethods < ActiveRecord::Migration
  def self.up
    create_table :payment_methods do |t|
      t.string :name
      t.boolean :is_default
      
      t.string :logo_file_name
      t.string :logo_content_type
      t.integer :logo_file_size
      t.datetime :logo_updated_at
      
      t.timestamps
    end
  end

  def self.down
    drop_table :payment_methods
  end
end
