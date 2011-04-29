# == Schema Information
# Schema version: 20110331071526
#
# Table name: categories
#
#  id                 :integer(4)      not null, primary key
#  name               :string(255)
#  parent_category_id :integer(4)
#  description        :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#

class Category < ActiveRecord::Base
  has_many :products
  belongs_to :parent_category, :class_name => "Category"

  validates :name, :presence => true, :uniqueness => true
  validates :description, :presence => true
  
end
