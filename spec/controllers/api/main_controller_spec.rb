require 'spec_helper'

describe Api::MainController do

  describe "GET 'menu'" do
    it "should be successful" do
      get 'menu'
      response.should be_success
    end
  end

end
