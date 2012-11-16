class TerminalSyncData < ActiveRecord::Base
  belongs_to :outlet
  
  TERMINAL_RELOAD_REQUEST = 1
  SYNC_TABLE_ORDER_REQUEST = 2
  ORDER_READY_REQUEST = 3
  
  serialize :data, Hash
  
  validates :sync_type, :presence => true
  validates :sync_type, :inclusion => { :in => [TERMINAL_RELOAD_REQUEST, SYNC_TABLE_ORDER_REQUEST, ORDER_READY_REQUEST] }
  validates :time, :presence => true
  validates :data, :presence => true
  
  def self.fetch_sync_table_order_times current_outlet
    current_outlet.terminal_sync_data.find_all_by_sync_type(SYNC_TABLE_ORDER_REQUEST, :order => "terminal_sync_data.time", :lock => true)
  end
  
  def self.fetch_terminal_reload_request_times current_outlet
    current_outlet.terminal_sync_data.find_all_by_sync_type(TERMINAL_RELOAD_REQUEST, :order => "terminal_sync_data.time", :lock => true)
  end
  
  def self.fetch_order_ready_request_times current_outlet
    current_outlet.terminal_sync_data.find_all_by_sync_type(ORDER_READY_REQUEST, :order => "terminal_sync_data.time", :lock => true)
  end
  
  def self.remove_sync_data_for_table table_id, current_outlet
    current_outlet.terminal_sync_data.all.each do |sync_data|
      if sync_data.data[:table_id].to_s ==  table_id.to_s
        sync_data.destroy
      end
    end
  end
  
  def self.request_reload_app terminal_id, current_outlet
    TerminalSyncData.transaction do
      TerminalSyncData.fetch_terminal_reload_request_times(current_outlet).each do |tsd|
        if !tsd.data[:hard_reset]
          tsd.destroy
        end
      end
    
      @now_local_millis = GlobalSetting.now_local_millis
      
      TerminalSyncData.create!({:outlet_id => current_outlet.id, :sync_type => TerminalSyncData::TERMINAL_RELOAD_REQUEST, 
          :time => @now_local_millis.to_s, :data => {:terminal_id => terminal_id}})
    end
  end
  
  def self.request_hard_reload_app terminal_id, current_outlet
    TerminalSyncData.transaction do
      TerminalSyncData.fetch_terminal_reload_request_times(current_outlet).each do |tsd|
        tsd.destroy
      end
    
      @now_local_millis = GlobalSetting.now_local_millis
      
      TerminalSyncData.create!({:outlet_id => current_outlet.id, :sync_type => TerminalSyncData::TERMINAL_RELOAD_REQUEST, 
          :time => @now_local_millis.to_s, :data => {:terminal_id => terminal_id, :hard_reset => true}})
    end
  end
  
  def self.request_notify_order_ready order_num, employee_id, terminal_id, table_info, current_outlet
    TerminalSyncData.transaction do
      TerminalSyncData.fetch_order_ready_request_times(current_outlet).each do |tsd|
        if tsd.data[:table_id].to_s ==  table_info.id.to_s
          tsd.destroy
        end
      end
      
      @now_local_millis = GlobalSetting.now_local_millis
      
      TerminalSyncData.create!({:outlet_id => current_outlet.id, :sync_type => TerminalSyncData::ORDER_READY_REQUEST, 
          :time => @now_local_millis.to_s, :data => {:order_num => order_num, :employee_id => employee_id, :terminal_id => terminal_id, :table_id => table_info.id, :table_label => table_info.perm_id}})
    end
  end
  
end



# == Schema Information
#
# Table name: terminal_sync_data
#
#  id         :integer(8)      not null, primary key
#  sync_type  :integer(4)
#  time       :string(255)
#  data       :text(2147483647
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(8)
#

