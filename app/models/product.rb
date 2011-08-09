# == Schema Information
# Schema version: 20110526094125
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
#  tax_rate_id                :integer(4)
#

class Product < ActiveRecord::Base

  has_attached_file :product_image, :styles => { :medium => "300x300>", :thumb => "115x115>" },
    :storage => :s3,
    :bucket => S3_BUCKET_NAME,
    :s3_credentials => {
    :access_key_id => S3_ACCESS_KEY_ID,
    :secret_access_key => S3_SECRET_ACCESS_KEY
  }
  
  belongs_to :category
  belongs_to :tax_rate
  
  belongs_to :modifier_category
  has_many :order_items
  has_many :menu_items, :dependent => :destroy
  
  validates :brand, :presence => true
  validates :name, :presence => true
  validates :category_id, :numericality => true, :allow_blank => true
  validates :description, :presence => true
  validates :size, :numericality => true, :allow_blank => true
  validates :price, :presence => true, :numericality => true
  validates :items_per_unit, :numericality => true, :allow_blank => true
  validates :sales_tax_rate, :numericality => true, :allow_blank => true

  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def has_product_image?
    return (!product_image_file_name.nil? and !product_image_file_name.blank?)
  end
  
  def self.categoryless
    find_all_by_category_id(nil)
  end
  
  def sales_tax_rate
    if tax_rate_id.blank?
      if category_id
        if category.tax_rate_id.blank?
          TaxRate.load_default.rate
        else
          category.tax_rate.rate
        end
      else
        TaxRate.load_default.rate
      end
    else
      tax_rate.rate
    end
  end
end
