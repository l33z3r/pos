class EnsureEmployeeVarsSet < ActiveRecord::Migration
  def self.up
    change_column :employees, :hourly_rate, :float, :default => 0, :null => false
    execute("update employees set hourly_rate = 0 where hourly_rate is null")
    
    change_column :employees, :overtime_rate, :float, :default => 0, :null => false
    execute("update employees set overtime_rate = 0 where overtime_rate is null")
  end

  def self.down
    #doesn't matter
  end
end
