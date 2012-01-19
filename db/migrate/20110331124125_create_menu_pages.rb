class CreateMenuPages < ActiveRecord::Migration
  def self.up
    create_table :menu_pages do |t|
      t.string :name
      t.integer :display_id
      t.integer :page_num

      t.timestamps
    end
  end

  def self.down
    drop_table :menu_pages
  end
end
