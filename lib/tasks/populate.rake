namespace :db do
  desc "Erase and fill products/categories/displays/menu items in database"
  task :populate => :environment do

    [Category, Product, Display, MenuPage, MenuItem].each(&:delete_all)

    Category.populate 4 do |category|
      category.name = Populator.words(1..2).titleize
      category.description = Populator.words(1..6).titleize
      Product.populate 10..20 do |product|
        product.category_id = category.id
        product.brand = Populator.words(1..5).titleize
        product.name = Populator.words(1..2).titleize
        product.description = Populator.words(10..30)
        product.price = [1, 2, 4, 6, 10]
      end
    end

    Display.populate 1 do |display|
      display.name = Populator.words(1..2).titleize

      page_count = 1

      MenuPage.populate 4 do |menu_page|
        menu_page.display_id = display.id
        menu_page.name = Populator.words(1..2).titleize
        
        menu_page.page_num = page_count
        
        page_count += 1

        x = 1
        y = 1

        MenuItem.populate 10..20 do |menu_item|
          menu_item.menu_page_id = menu_page.id
          menu_item.product_id = Product.first(:order => "RAND()")

          menu_item.grid_x = x
          menu_item.grid_y = y

          x += 1
          if x==5
            y += 1
            x = 1
          end
        end
      end
    end
  end
end