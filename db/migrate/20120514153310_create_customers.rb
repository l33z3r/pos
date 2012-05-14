class CreateCustomers < ActiveRecord::Migration
  def self.up
    create_table :customers do |t|
      t.string :name
      t.string :contact_name
      
      t.string :address
      t.string :postal_address
      
      t.string :telephone
      t.string :mobile
      t.string :fax
      t.string :email

      t.float :credit_limit
      t.float :current_balance
      t.float :credit_available

      t.integer :loyalty_level_id
      t.integer :available_points
      t.string :swipe_card_code
      
      t.timestamps
    end
  end

  def self.down
    drop_table :customers
  end
end
