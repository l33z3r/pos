class CreateStoredReceiptHtmls < ActiveRecord::Migration
  def self.up
    create_table :stored_receipt_htmls do |t|
      t.string :receipt_type
      t.string :receipt_key
      t.text :stored_html

      t.timestamps
    end
  end

  def self.down
    drop_table :stored_receipt_htmls
  end
end
