class State < ActiveRecord::Base
  attr_accessible :id, :iso, :name, :country_id
end
# == Schema Information
#
# Table name: states
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  country_id :integer(4)
#  iso        :string(255)
#

