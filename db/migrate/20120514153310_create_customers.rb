class CreateCustomers < ActiveRecord::Migration
  def self.up
    create_table :customers do |t|
      t.string :name
      t.string :contact_name
      t.date :dob
      
      t.string :address
      t.string :postal_address
      
      t.string :telephone
      t.string :mobile
      t.string :fax
      t.string :email

      t.float :credit_limit, :default => 0, :null => false
      t.float :current_balance, :default => 0, :null => false
      t.float :credit_available, :default => 0, :null => false

      t.integer :loyalty_level_id
      t.integer :available_points, :default => 0, :null => false
      t.string :swipe_card_code
      
      t.timestamps
    end
  end

  def self.down
    drop_table :customers
  end
end
