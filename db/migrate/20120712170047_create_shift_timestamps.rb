class CreateShiftTimestamps < ActiveRecord::Migration
  def self.up
    create_table :shift_timestamps do |t|
      t.integer :employee_id
      t.integer :timestamp_type
      t.timestamps
    end
  end

  def self.down
    drop_table :shift_timestamps
  end
end
