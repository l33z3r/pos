# == Schema Information
# Schema version: 20110427122814
#
# Table name: modifiers
#
#  id                   :integer(4)      not null, primary key
#  modifier_category_id :integer(4)
#  name                 :string(255)
#  price                :float
#  created_at           :datetime
#  updated_at           :datetime
#

class Modifier < ActiveRecord::Base
  belongs_to :modifier_category

  validates :name, :presence => true
  validates :price, :presence => true, :numericality => true
end
