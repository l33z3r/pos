class CreateOutletTerminals < ActiveRecord::Migration
  def self.up
    create_table :outlet_terminals do |t|
      t.integer :outlet_id
      t.string :name
      t.timestamps
    end
  end

  def self.down
    drop_table :outlet_terminals
  end
end
