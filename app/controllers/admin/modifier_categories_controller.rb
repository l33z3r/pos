class Admin::ModifierCategoriesController < Admin::AdminController
  def index
    @modifier_categories = current_outlet.modifier_categories.all
  end

  def show
    @modifier_category = current_outlet.modifier_categories.find(params[:id])
  end

  def new
    @modifier_category = ModifierCategory.new

    3.times do
      @modifier_category.modifiers.build
    end
  end

  def edit
    @modifier_category = current_outlet.modifier_categories.find(params[:id])
  end

  def create
    @modifier_category = ModifierCategory.new(params[:modifier_category])

    @modifier_category.outlet_id = current_outlet.id
    
    @modifier_category.modifiers.each do |m|
      m.outlet_id = current_outlet.id
      m.save
    end
    
    if @modifier_category.save
      redirect_to [:admin, @modifier_category], :notice => 'Modifier category was successfully created.'
    else
      render :action => "new"
    end
  end

  def update
    @modifier_category = current_outlet.modifier_categories.find(params[:id])

    if @modifier_category.update_attributes(params[:modifier_category])
      @modifier_category.modifiers.each do |m|
        m.outlet_id = current_outlet.id
        m.save
      end
    
      redirect_to [:admin, @modifier_category], :notice => 'Modifier category was successfully updated.'
    else
      render :action => "edit"
    end
  end

  def destroy
    @modifier_category = current_outlet.modifier_categories.find(params[:id])
    @modifier_category.destroy

    redirect_to admin_modifier_categories_url
  end
end
