class AddEmbeddedDisplayToMenuPage < ActiveRecord::Migration
  def self.up
    add_column :menu_pages, :embedded_display_id, :integer
  end

  def self.down
    remove_column :menu_pages, :embedded_display_id
  end
end
