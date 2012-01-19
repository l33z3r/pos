require 'test_helper'

class DisplaysControllerTest < ActionController::TestCase
  setup do
    @display = displays(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:displays)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create display" do
    assert_difference('Display.count') do
      post :create, :display => @display.attributes
    end

    assert_redirected_to display_path(assigns(:display))
  end

  test "should show display" do
    get :show, :id => @display.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @display.to_param
    assert_response :success
  end

  test "should update display" do
    put :update, :id => @display.to_param, :display => @display.attributes
    assert_redirected_to display_path(assigns(:display))
  end

  test "should destroy display" do
    assert_difference('Display.count', -1) do
      delete :destroy, :id => @display.to_param
    end

    assert_redirected_to displays_path
  end
end
