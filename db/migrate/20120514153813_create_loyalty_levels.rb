class CreateLoyaltyLevels < ActiveRecord::Migration
  def self.up
    create_table :loyalty_levels do |t|
      t.string :label
      t.float :percent
      t.boolean :is_default, :default => false
      
      t.timestamps
    end
  end

  def self.down
    drop_table :loyalty_levels
  end
end
