class EnsurePaymentIntegrationIdDefaultSet < ActiveRecord::Migration
  def self.up
    execute("ALTER TABLE payment_methods MODIFY column payment_integration_id BIGINT DEFAULT 0 NOT NULL")
  end

  def self.down
    #doesn't matter
  end
end
