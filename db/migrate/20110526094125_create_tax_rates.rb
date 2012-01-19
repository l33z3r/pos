class CreateTaxRates < ActiveRecord::Migration
  def self.up
    create_table :tax_rates do |t|
      t.string :name
      t.float :rate
      t.boolean :is_default
      
      t.timestamps
    end
    
    add_column :products, :tax_rate_id, :integer
    add_column :categories, :tax_rate_id, :integer
  end

  def self.down
    drop_table :tax_rates
    
    remove_column :products, :tax_rate_id
    remove_column :categories, :tax_rate_id
  end
end
