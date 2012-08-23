class CreatePrinters < ActiveRecord::Migration
  def self.up
    create_table :printers do |t|
      t.integer :outlet_id
      t.string :label
      t.string :network_path
      t.integer :paper_width_mm, :default => 80
      t.integer :font_size, :default => 11
      t.timestamps
    end
    
    execute("update products set blocked_printers = null")
    execute("update categories set blocked_printers = null")
    execute("update products set printers = null")
    execute("update categories set printers = null")
  end

  def self.down
    drop_table :printers
  end
end
