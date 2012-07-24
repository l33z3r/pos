class EnsureHourlyRateOnEmployeesSet < ActiveRecord::Migration
  def self.up
    execute("update employees set hourly_rate = 0 where hourly_rate is null")
    execute("update employees set overtime_rate = 0 where overtime_rate is null")
  end

  def self.down
    #ignore
  end
end
