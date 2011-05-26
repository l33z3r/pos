require 'test_helper'

class CustomThemeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get update_setting" do
    get :update_setting
    assert_response :success
  end

  test "should get custom_theme" do
    get :custom_theme
    assert_response :success
  end

end
