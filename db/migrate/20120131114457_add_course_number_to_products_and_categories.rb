class AddCourseNumberToProductsAndCategories < ActiveRecord::Migration
  def self.up
    add_column :products, :course_num, :integer, :default => -1
    add_column :categories, :course_num, :integer, :default => -1
  end

  def self.down
    remove_column :products, :course_num
    remove_column :categories, :course_num
  end
end
