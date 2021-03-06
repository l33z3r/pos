json.(@display, :id, :name)

json.menu_pages @display.menu_pages do |json, page|
    json.(page, :id, :name, :page_num)

    if page.embedded_display
        json.menu_pages page.embedded_display.menu_pages do |json, embedded_page|
           json.menu_items embedded_page.menu_items do |json, item|
                next unless item.product

                json.(item, :id, :name)
                json.(item.product, :id, :price, :double_price, :half_price, :is_deleted, :category_id, :order_item_addition_grid_id, :order_item_addition_grid_id_is_mandatory, :name, :upc)
                json.img_url product_image_url(item.product)
            end 
        end
    else
        json.menu_items page.menu_items do |json, item|
            next unless item.product

            json.(item, :id, :name)
            json.(item.product, :id, :price, :double_price, :half_price, :is_deleted, :category_id, :order_item_addition_grid_id, :order_item_addition_grid_id_is_mandatory, :name, :upc)
            json.img_url product_image_url(item.product)
        end
    end
end