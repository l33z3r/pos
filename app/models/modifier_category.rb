class ModifierCategory < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :modifiers, :dependent => :destroy
  accepts_nested_attributes_for :modifiers, :allow_destroy => true, :reject_if => :all_blank

  validates :name, :presence => true
end

# == Schema Information
#
# Table name: modifier_categories
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(4)
#

