# == Schema Information
# Schema version: 20110429080107
#
# Table name: products
#
#  id                         :integer(4)      not null, primary key
#  brand                      :string(255)
#  name                       :string(255)
#  category_id                :integer(4)
#  description                :string(255)
#  size                       :float
#  unit                       :string(255)
#  items_per_unit             :integer(4)
#  sales_tax_rate             :float
#  price                      :float
#  created_at                 :datetime
#  updated_at                 :datetime
#  product_image_file_name    :string(255)
#  product_image_content_type :string(255)
#  product_image_file_size    :integer(4)
#  product_image_updated_at   :datetime
#  modifier_category_id       :integer(4)
#

class Product < ActiveRecord::Base

  has_attached_file :product_image, :styles => { :medium => "300x300>", :thumb => "115x115>" }

  belongs_to :category
  belongs_to :modifier_category
  has_many :order_items

  validates :brand, :presence => true
  validates :name, :presence => true
  validates :category_id, :presence => true, :numericality => true
  validates :description, :presence => true
  validates :size, :presence => true, :numericality => true
  validates :price, :presence => true, :numericality => true
  validates :unit, :presence => true
  validates :items_per_unit, :presence => true, :numericality => true
  validates :sales_tax_rate, :presence => true, :numericality => true

  def has_product_image?
    return (!product_image_file_name.nil? and !product_image_file_name.blank?)
  end
end
