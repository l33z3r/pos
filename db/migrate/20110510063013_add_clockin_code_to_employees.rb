class AddClockinCodeToEmployees < ActiveRecord::Migration
  def self.up
    add_column :employees, :clockin_code, :string
    
    Employee.all.each do |e|
      e.clockin_code = e.passcode
      e.save
    end
  end

  def self.down
    remove_column :employees, :clockin_code
  end
end
