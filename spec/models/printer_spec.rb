require 'spec_helper'

describe Printer do
  pending "add some examples to (or delete) #{__FILE__}"
end




# == Schema Information
#
# Table name: printers
#
#  id             :integer(4)      not null, primary key
#  outlet_id      :integer(4)
#  label          :string(255)
#  network_path   :string(255)
#  paper_width_mm :integer(4)      default(80)
#  font_size      :integer(4)      default(11)
#  created_at     :datetime
#  updated_at     :datetime
#

