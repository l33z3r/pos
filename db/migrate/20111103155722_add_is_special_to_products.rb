class AddIsSpecialToProducts < ActiveRecord::Migration
  def self.up
    change_table :products do |t|
      t.boolean :is_special, :default => false
    end
  end

  def self.down
    change_table :products do |t|
      t.remove :is_special
    end
  end
end
