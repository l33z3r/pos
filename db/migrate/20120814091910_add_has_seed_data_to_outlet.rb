class AddHasSeedDataToOutlet < ActiveRecord::Migration
  def self.up
    add_column :outlets, :has_seed_data, :boolean, :default => false
  end

  def self.down
    remove_column :outlets, :has_seed_data
  end
end
