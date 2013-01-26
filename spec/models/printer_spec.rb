require 'spec_helper'

describe Printer do
  pending "add some examples to (or delete) #{__FILE__}"
end









# == Schema Information
#
# Table name: printers
#
#  id                 :integer(8)      not null, primary key
#  outlet_id          :integer(8)
#  label              :string(255)
#  local_printer      :string(255)
#  paper_width_mm     :integer(4)      default(80)
#  font_size          :integer(4)      default(13)
#  created_at         :datetime
#  updated_at         :datetime
#  owner_fingerprint  :string(255)
#  printer_type       :integer(4)
#  network_share_name :string(255)
#

