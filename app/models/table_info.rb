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
  GHOST_TABLE = TableInfo.new({:id => 0, :perm_id => 0})
  
  belongs_to :room_object, :dependent => :destroy
  
  validates :perm_id, :presence => true
  
  def self.all
    where("perm_id != 0")
  end
  
  #need to stub this out for the ghost table
  def id
    if(perm_id == 0)
      return 0
    else
      super
    end
  end
  
  def self.find_by_id(theid)
    if theid.to_s == "0"
      return GHOST_TABLE
    else
      super theid
    end
  end
end
