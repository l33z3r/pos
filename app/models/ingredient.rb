class Ingredient < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :product
  belongs_to :ingredient_product, :class_name => "Product", :foreign_key => "ingredient_product_id"  
  
  def stock_usage
    (quantity_numerator.to_f / quantity_denominator.to_f)
  end
end




# == Schema Information
#
# Table name: ingredients
#
#  id                    :integer(4)      not null, primary key
#  product_id            :integer(4)
#  ingredient_product_id :integer(4)
#  quantity_numerator    :float           default(1.0)
#  quantity_denominator  :float           default(1.0)
#  created_at            :datetime
#  updated_at            :datetime
#  outlet_id             :integer(4)
#

