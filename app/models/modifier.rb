class Modifier < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :modifier_category

  validates :name, :presence => true
  validates :price, :presence => true, :numericality => true
end


# == Schema Information
#
# Table name: modifiers
#
#  id                   :integer(8)      not null, primary key
#  modifier_category_id :integer(8)
#  name                 :string(255)
#  price                :float
#  created_at           :datetime
#  updated_at           :datetime
#  outlet_id            :integer(8)
#

