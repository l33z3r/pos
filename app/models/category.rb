# == Schema Information
# Schema version: 20110526094125
#
# Table name: categories
#
#  id                 :integer(4)      not null, primary key
#  name               :string(255)
#  parent_category_id :integer(4)
#  description        :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#  tax_rate_id        :integer(4)
#

class Category < ActiveRecord::Base
  has_many :products
  belongs_to :tax_rate
  
  belongs_to :parent_category, :class_name => "Category"

  validates :name, :presence => true, :uniqueness => true
  validates :description, :presence => true
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
end
