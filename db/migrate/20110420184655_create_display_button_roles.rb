class CreateDisplayButtonRoles < ActiveRecord::Migration
  def self.up
    create_table :display_button_roles do |t|
      t.integer :display_button_id
      t.integer :role_id
      t.boolean :show_on_sales_screen, :default => false
      t.boolean :show_on_admin_screen, :default => false
      t.timestamps
    end
  end

  def self.down
    drop_table :display_button_roles
  end
end
