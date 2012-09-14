class AddColumnsToWorkReport < ActiveRecord::Migration
  def self.up
    #need to clear work reports again
    ShiftTimestamp.all.each(&:destroy)
    WorkReport.all.each(&:destroy)

    add_column :work_reports, :hourly_rate, :float
    add_column :work_reports, :cost, :float
  end

  def self.down
    remove_column :work_reports, :hourly_rate
    remove_column :work_reports, :cost
  end
end
