# == Schema Information
# Schema version: 20110705150431
#
# Table name: terminal_sync_data
#
#  id         :integer(4)      not null, primary key
#  sync_type  :integer(4)
#  time       :string(255)
#  data       :text
#  created_at :datetime
#  updated_at :datetime
#

class TerminalSyncData < ActiveRecord::Base
  TERMINAL_RELOAD_REQUEST = 1
  SYNC_TABLE_ORDER_REQUEST = 2
  
  serialize :data, Hash
  
  validates :sync_type, :presence => true
  validates :sync_type, :inclusion => { :in => [TERMINAL_RELOAD_REQUEST, SYNC_TABLE_ORDER_REQUEST] }
  validates :time, :presence => true
  validates :data, :presence => true
  
  def self.fetch_sync_table_order_times
    find_all_by_sync_type(SYNC_TABLE_ORDER_REQUEST, :order => "terminal_sync_data.time", :lock => true)
  end
  
  def self.fetch_terminal_reload_request_times
    find_all_by_sync_type(TERMINAL_RELOAD_REQUEST, :order => "terminal_sync_data.time", :lock => true)
  end
end
