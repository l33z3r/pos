json.(@display, :id, :name)

json.menu_pages @display.menu_pages do |json, page|
    json.(page, :id, :name, :page_num)

    json.menu_items page.menu_items do |json, item|
        next unless item.product

        json.(item, :id, :name)
        json.product item.product, :id, :price, :double_price, :deleted, :category_id, :modifier_grid_id, :modifier_grid_id_mandatory, :name, :upc      
    end
end