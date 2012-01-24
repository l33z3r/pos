require 'csv'

class Admin::ProductsController < Admin::AdminController
  cache_sweeper :product_sweeper

  def index
    if (session[:search1].nil? && session[:search2].nil? && session[:search3].nil?)
      @selected_letter = "all"
      @products = Product.where("is_deleted = ?", false).order("name")
    else
      search
    end
    query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from products group by substr(name,1,1)")
    @letters = []
    for element in query
      if (!"0123456789".include?(element[0]))
        element[0].upcase!
        @letters += element
      end
    end
  end

  def csv_import

  end

  def csv_upload
    @product_count = 0
    @category_count = 0
    @department_count = 0

    @products = []

    @csv_validation_errors = {}
    @validation_passed = true

    @first_row = true

    @categories = {}
    @departments = {}

    CSV.parse(params[:dump_file].read) do |row|
      if @first_row
        @first_row = false
        next
      end

      @product_count += 1

      @department_name = ProductCSVMapper::department_from_row row
      @category_name = ProductCSVMapper::category_from_row row

      if @department_name and !@departments[@department_name]
        @departments[@department_name] = []
      end

      if @category_name and !@categories[@category_name]
        @categories[@category_name] = []
      end

      @new_product = ProductCSVMapper::product_from_row row

      if @department_name and @category_name
        @departments[@department_name] << @category_name
      end

      if @category_name
        @categories[@category_name] << @new_product
      end

        #validate the product
      logger.info "!!!VALID? #{@new_product.valid?}"

      @name_taken = false

      @products.each do |p|
        if p.name == @new_product.name
          @name_taken = true
          @new_product.errors.add "name", "is already taken"
        end
      end

      if !@new_product.valid? or @name_taken
        @validation_passed = false

        @csv_validation_errors[@product_count] = {
            :row_data => row,
            :errors => @new_product.errors
        }
      end

      @products << @new_product

      logger.info "!!!!#{@new_product.name}"
    end

    if @validation_passed

      @products.each do |p|
        #attatch an image
        p.set_image
        p.save
        p.reload
      end

        #build the categories
      @categories.each do |name, products|
        @category_product_ids = products.collect &:id

        @new_category = Category.find_or_initialize_by_name(name)

        if @new_category.new_record?
          @category_count += 1
          @new_category.save
          @new_category.reload
        end

        Product.update_all({:category_id => @new_category.id}, {:id => @category_product_ids})
      end

        #build the departments
      @departments.each do |dep_name, category_names|
        @new_department = Category.find_or_initialize_by_name(dep_name)

        if @new_department.new_record?
          @department_count += 1
          @new_department.save
          @new_department.reload
        end

          #we don't override a category if it already has a department
        category_names.each do |cn|
          c = Category.find_by_name(cn)
          if !c.parent_category
            c.parent_category_id = @new_department.id
            c.save
          end
        end
      end

      flash[:notice] = "CSV Import Successful! #{@product_count} new products, #{@category_count} new categories and #{@department_count} new departments have been added to the database."
      redirect_to admin_products_path
    else
      flash.now[:error] = "Import Failed, please check the errors and modify the CSV file accordingly."
      render :csv_import
    end

  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @hide_admin_header = true
    @product = Product.new
  end

  def edit
    @hide_admin_header = true
    @product = Product.find(params[:id])
  end

  def create
    @product = Product.new(params[:product])

    @new_menu_1_id = params[:product][:menu_page_1_id]
    @old_menu_1_id = @product.menu_page_1 ? @product.menu_page_1.id : nil
    @new_menu_2_id = params[:product][:menu_page_2_id]
    @old_menu_2_id = @product.menu_page_2 ? @product.menu_page_2.id : nil

    if @product.save
      update_menus_for_product @product, @new_menu_1_id, @old_menu_1_id, @new_menu_2_id, @old_menu_2_id
      redirect_to(admin_products_url, :notice => 'Product was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @product = Product.find(params[:id])

    if params[:delete_product_image]
      @product.product_image.destroy #Will remove the attachment and save the model
      @product.product_image.clear #Will queue the attachment to be deleted
    end

    @new_menu_1_id = params[:product][:menu_page_1_id]
    @old_menu_1_id = @product.menu_page_1 ? @product.menu_page_1.id : nil
    @new_menu_2_id = params[:product][:menu_page_2_id]
    @old_menu_2_id = @product.menu_page_2 ? @product.menu_page_2.id : nil

    if @product.update_attributes(params[:product])

      update_menus_for_product @product, @new_menu_1_id, @old_menu_1_id, @new_menu_2_id, @old_menu_2_id

        #we may have came to this page directly from the menu builder screen
        #we want to store the fact, so that when we update the product, we go back to that screen
      if !params[:back_builder_screen_id].blank?
        @display = Display.find(params[:back_builder_screen_id])
        redirect_to(builder_admin_display_path(@display), :notice => 'Product was successfully updated.')
      else
        redirect_to(admin_products_url, :notice => 'Product was successfully updated.')
      end
    else
      @hide_admin_header = true
      render :action => "edit"
    end
  end

  def product_image_dialog

    @selected_images = Array.new
    @selected_names = Array.new
    @first_letters = Array.new
    @all_product_images = Dir.glob(Product::PRODUCT_IMAGE_DIRECTORY)

    if params[:letter]
    @all_product_images.each_with_index do |image, index|
      current_file =  @all_product_images[index].split("#{Rails.root}/public/images/product_images/")[1]
      curr_letter = current_file[0].downcase
      @first_letters.push curr_letter
      if curr_letter.downcase == params[:letter].downcase
            @selected_images.push current_file
            @selected_names.push current_file.split(".")[0]
      end
    end
    else
      @all_product_images.each_with_index do |image, index|
      current_file =  @all_product_images[index].split("#{Rails.root}/public/images/product_images/")[1]
      curr_letter = current_file[0].downcase
      @first_letters.push curr_letter
      if curr_letter.downcase == "a"
            @selected_images.push current_file
            @selected_names.push current_file.split(".")[0]
      end
    end
    end

    @first_letters = @first_letters.uniq.sort
    render "product_image_dialog"

  end

  def update_price
    @product = Product.find(params[:id])
    @product.price = params[:price]
    @product.save!

    render :json => {:success => true}.to_json
  end

  def search
    #get parameters from request or session
    if (!params[:search1].nil? || !params[:search2].nil? || !params[:search3].nil?)
      @param1 = params[:search1]
      @param2 = params[:search2]
      @param3 = params[:search3]
      save_params(@param1, @param2, @param3)
    else
      @param1 = session[:search1]
      @param2 = session[:search2]
      @param3 = session[:search3]
      get_session_parameters_to_fields
    end
      #search
    @search1 = Product.search(@param1).order('name')
    @products1 = @search1.all
    if (!@param2.nil? && !@param3.nil?)
      @search2 = Product.where("(code_num = ? OR upc = ? OR price = ? OR price_2 = ? OR price_3 = ? OR price_4) AND is_deleted = false", @param2, @param2, @param2, @param2, @param2).order('name')
      @search3 = Product.search(@param3).order('name')
      @products2 = @search2.all
      @products3 = @search3.all
      @merge1 = @products2 | @products3
      @intersection = @merge1 & @products1
      @products = @intersection.sort! { |a, b| a.name <=> b.name }
    else
      @products = @products1.sort! { |a, b| a.name <=> b.name }
    end
  end

  def mark_as_deleted
    @product = Product.find(params[:id])
    @product.mark_as_deleted

      #send a reload request to other terminals
    request_reload_app @terminal_id

    render :json => {:success => true}.to_json
  end

  private

  def get_session_parameters_to_fields
    @selected_letter = (!session[:search1][:name_starts_with].eql?("")) ? session[:search1][:name_starts_with] : ((!session[:search1][:name_starts_with_any].eql?("")) ? "hash" : "all")
    @session_code_num_upc = session[:search1][:code_num_or_upc_equals]
    @session_description = session[:search1][:description_contains]
    @session_category = session[:search1][:category_id_equals]
    @session_menu = session[:search1][:menu_page_1_id_equals]
    @session_all_fields = session[:search2]
    @session_is_specials = (session[:search1][:is_special_equals] == "true") ? true : false;
    @session_is_deleted = (session[:search1][:is_deleted_equals] == "true") ? true : false;
  end

  def save_params param1, param2, param3
    session[:search1] = param1
    session[:search2] = param2
    session[:search3] = param3
  end

  def update_menus_for_product product, new_menu_1_id, old_menu_1_id, new_menu_2_id, old_menu_2_id
    update_menu_for_product product, new_menu_1_id, old_menu_1_id
    update_menu_for_product product, new_menu_2_id, old_menu_2_id
  end

  def update_menu_for_product product, new_menu_id, old_menu_id

    return if new_menu_id == old_menu_id

      #remove it from old_menu_id
    if !old_menu_id.blank?
      @old_menu_page = MenuPage.find(old_menu_id)

      @old_menu_page.menu_items.each do |mi|
        next if !mi.product

        if mi.product.id == product.id
          MenuItem.delete_menu_item mi
          break
        end
      end
    end

      #add it to new_menu_id if it's not already there
    if !new_menu_id.blank?
      @new_menu_page = MenuPage.find(new_menu_id)

      @new_menu_page.menu_items.each do |mi|
        next if !mi.product

        if mi.product.id == product.id
          return
        end
      end

      if (!@new_menu_page.menu_items.last)
        @next_order_num = 1
      else
        @next_order_num = @new_menu_page.menu_items.last.order_num + 1
      end

      @menu_item = MenuItem.create({:product_id => product.id,
                                    :menu_page_id => new_menu_id, :order_num => @next_order_num})
    end

  end

end
