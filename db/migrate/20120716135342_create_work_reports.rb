class CreateWorkReports < ActiveRecord::Migration
  def self.up
    create_table :work_reports do |t|
      t.integer :employee_id
      t.text :report_data
      t.timestamps
    end
  end

  def self.down
    drop_table :work_reports
  end
end
