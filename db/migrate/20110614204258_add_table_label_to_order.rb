class AddTableLabelToOrder < ActiveRecord::Migration
  def self.up
    add_column :orders, :table_info_label, :string
  end

  def self.down
    remove_column :orders, :table_info_label
  end
end
