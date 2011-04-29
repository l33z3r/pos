require 'test_helper'

class ModifierCategoriesControllerTest < ActionController::TestCase
  setup do
    @modifier_category = modifier_categories(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:modifier_categories)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create modifier_category" do
    assert_difference('ModifierCategory.count') do
      post :create, :modifier_category => @modifier_category.attributes
    end

    assert_redirected_to modifier_category_path(assigns(:modifier_category))
  end

  test "should show modifier_category" do
    get :show, :id => @modifier_category.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @modifier_category.to_param
    assert_response :success
  end

  test "should update modifier_category" do
    put :update, :id => @modifier_category.to_param, :modifier_category => @modifier_category.attributes
    assert_redirected_to modifier_category_path(assigns(:modifier_category))
  end

  test "should destroy modifier_category" do
    assert_difference('ModifierCategory.count', -1) do
      delete :destroy, :id => @modifier_category.to_param
    end

    assert_redirected_to modifier_categories_path
  end
end
