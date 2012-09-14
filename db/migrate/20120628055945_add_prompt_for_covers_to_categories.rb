class AddPromptForCoversToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :prompt_for_covers, :boolean, :default => false
  end

  def self.down
    remove_column :categories, :prompt_for_covers
  end
end
