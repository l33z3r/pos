# == Schema Information
# Schema version: 20110512185508
#
# Table name: table_infos
#
#  id             :integer(4)      not null, primary key
#  perm_id        :string(255)
#  room_object_id :integer(4)
#  created_at     :datetime
#  updated_at     :datetime
#

class TableInfo < ActiveRecord::Base
  belongs_to :room_object, :dependent => :destroy
  
  validates :perm_id, :presence => true
end
