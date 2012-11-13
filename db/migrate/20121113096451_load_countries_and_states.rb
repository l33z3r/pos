class LoadCountriesAndStates < ActiveRecord::Migration
  def self.up

    # load
    require File.expand_path('../../seeds/state_country_seeds.rb', __FILE__)

  end

  def self.down
    Country.delete_all
    State.delete_all
  end
end
