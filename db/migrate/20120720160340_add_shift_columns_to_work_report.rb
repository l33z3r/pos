class AddShiftColumnsToWorkReport < ActiveRecord::Migration
  def self.up
    add_column :work_reports, :clockin_time, :datetime
    add_column :work_reports, :clockout_time, :datetime

    add_column :work_reports, :shift_seconds, :integer, :default => 0
    add_column :work_reports, :break_seconds, :integer, :default => 0
    add_column :work_reports, :payable_seconds, :integer, :default => 0
  end

  def self.down
    remove_column :work_reports, :clockin_time
    remove_column :work_reports, :clockout_time

    remove_column :work_reports, :shift_seconds
    remove_column :work_reports, :break_seconds
    remove_column :work_reports, :payable_seconds
  end
end
