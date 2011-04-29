# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

#Fergie
@employee = Employee.find_or_create_by_staff_id(1);

@employee.update_attributes({:name => "Fergus Lynch", :nickname => "fergie",
    :passcode => "1111", :address => "Millbank", :telephone => "0863888181",
    :hourly_rate => 9, :overtime_rate => 12, :is_admin => true})

#Lee
@employee = Employee.find_or_create_by_staff_id(2);

@employee.update_attributes({:name => "Lee Farrell", :nickname => "l33z3r", 
    :passcode => "2222", :address => "Clonshaugh", :telephone => "0857230738",
    :hourly_rate => 9, :overtime_rate => 12, :is_admin => true})

#random non-admin user
@employee = Employee.find_or_create_by_staff_id(3);

@employee.update_attributes({:name => "Johnny Five", :nickname => "jonny",
    :passcode => "3333", :address => "Neverland", :telephone => "0888767541",
    :hourly_rate => 9, :overtime_rate => 12, :is_admin => false})