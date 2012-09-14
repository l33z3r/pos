class AddAllocationTypeToCustomerPointsAllocation < ActiveRecord::Migration
  def self.up
    add_column :customer_points_allocations, :allocation_type, :integer
    
    execute("update customer_points_allocations set allocation_type = #{CustomerPointsAllocation::SALE_EARN} where amount >= 0")
    execute("update customer_points_allocations set allocation_type = #{CustomerPointsAllocation::SALE_REDUCE} where amount < 0")
  end

  def self.down
    remove_column :customer_points_allocations, :allocation_type
  end
end
