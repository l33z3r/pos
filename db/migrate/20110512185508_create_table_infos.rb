class CreateTableInfos < ActiveRecord::Migration
  def self.up
    create_table :table_infos do |t|
      t.string :perm_id
      t.integer :room_object_id

      t.timestamps
    end
  end

  def self.down
    drop_table :table_infos
  end
end
