class Delivery < ActiveRecord::Base
  belongs_to :employee
end



# == Schema Information
#
# Table name: deliveries
#
#  id               :integer(4)      not null, primary key
#  employee_id      :integer(4)
#  total            :float
#  created_at       :datetime
#  updated_at       :datetime
#  received_date    :datetime
#  reference_number :string(255)
#  terminal_id      :string(255)
#

