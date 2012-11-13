class Country < ActiveRecord::Base
  attr_accessible :id, :iso, :name
end
# == Schema Information
#
# Table name: countries
#
#  id   :integer(4)      not null, primary key
#  iso  :string(255)
#  name :string(255)
#

