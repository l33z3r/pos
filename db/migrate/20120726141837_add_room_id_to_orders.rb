class AddRoomIdToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :room_id, :integer   
    
    if Room.first
      @first_room_id = Room.first.id    
      execute("update orders set room_id = #{@first_room_id} where is_table_order and room_id is null")
    end
  end

  def self.down
    remove_column :orders, :room_id
  end
end
