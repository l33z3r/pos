class AddDisplayImageToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :display_image, :string
  end

  def self.down
    remove_column :products, :display_image
  end
end
