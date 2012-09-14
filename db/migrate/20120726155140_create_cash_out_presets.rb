class CreateCashOutPresets < ActiveRecord::Migration
  def self.up
    create_table :cash_out_presets do |t|
      t.string :label
      t.timestamps
    end
  end

  def self.down
    drop_table :cash_out_presets
  end
end
