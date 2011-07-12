class CreateRoles < ActiveRecord::Migration
  def self.up
    create_table :roles do |t|
      t.string :name

      t.timestamps
    end

    add_column :employees, :role_id, :integer, :default => 1

    @super_user_role = Role.create({:name => "Super User"})
    @super_user_role.save(false)

    @admin_employee = Employee.new({:staff_id => "1111", :name => "admin", :nickname => "admin",
        :passcode => "1111", :address => "admin address", :telephone => "admin telephone",
      :hourly_rate => "1", :overtime_rate => "1", :role_id => @super_user_role.id})
  
    @admin_employee.save(false)
  end

  def self.down
    remove_column :employees, :role_id
    drop_table :roles
  end
end
