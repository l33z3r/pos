class AddReferenceNumberToCardTransactions < ActiveRecord::Migration
  def self.up
    add_column :card_transactions, :reference_number, :string
  end

  def self.down
    remove_column :card_transactions, :reference_number
  end
end
