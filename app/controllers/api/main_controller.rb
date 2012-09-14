class Api::MainController < ApplicationController
  
  # $.getJSON('/api/menu.json', function(data) {alert(data.menu_pages.length);});
  def menu
    @display = Display.load_public
  end
  
  # $.getJSON('/api/products.json', function(data) {alert(data.products.length);});
  def products
    @products = Product.non_deleted
  end
  
  # $.getJSON('/api/categories.json', function(data) {alert(data.categories.length);});
  def categories
    @categories = Category.all
  end

end
