class Admin::ModifierCategoriesController < Admin::AdminController
  def index
    @modifier_categories = ModifierCategory.all
  end

  def show
    @modifier_category = ModifierCategory.find(params[:id])
  end

  def new
    @modifier_category = ModifierCategory.new

    3.times do
      @modifier_category.modifiers.build
    end
  end

  def edit
    @modifier_category = ModifierCategory.find(params[:id])
  end

  def create
    @modifier_category = ModifierCategory.new(params[:modifier_category])

    if @modifier_category.save
      redirect_to [:admin, @modifier_category], :notice => 'Modifier category was successfully created.'
    else
      render :action => "new"
    end
  end

  def update
    @modifier_category = ModifierCategory.find(params[:id])

    if @modifier_category.update_attributes(params[:modifier_category])
      redirect_to [:admin, @modifier_category], :notice => 'Modifier category was successfully updated.'
    else
      render :action => "edit"
    end
  end

  def destroy
    @modifier_category = ModifierCategory.find(params[:id])
    @modifier_category.destroy

    redirect_to admin_modifier_categories_url
  end
end
