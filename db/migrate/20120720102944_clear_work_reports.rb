class ClearWorkReports < ActiveRecord::Migration
  def self.up
    ShiftTimestamp.all.each(&:destroy)
    WorkReport.all.each(&:destroy)
  end

  def self.down
  end
end
