class Api::MainController < ApplicationController
  
  def menu
    @display = Display.load_public
  end
  
  def products
    @products = Product.non_deleted
  end
  
  def categories
    @categories = Category.all
  end

end
