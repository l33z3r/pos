class AddReferenceNumberAndDateToDeliveries < ActiveRecord::Migration
  def self.up
    add_column :deliveries, :received_date, :datetime
    add_column :deliveries, :reference_number, :string
  end

  def self.down
    remove_column :deliveries, :received_date
    remove_column :deliveries, :reference_number
  end
end
