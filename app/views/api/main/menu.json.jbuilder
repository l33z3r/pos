json.(@display, :id, :name)

json.menu_pages @display.menu_pages do |json, page|
    json.(page, :id, :name, :page_num)

    json.menu_items page.menu_items do |json, item|
        next unless item.product

        json.(item, :id, :name)
        json.product item.product, :id, :price, :double_price, :is_deleted, :category_id, :order_item_addition_grid_id, :order_item_addition_grid_id_is_mandatory, :name, :upc      
    end
end