class Reports::GlancesController < ApplicationController
  layout 'reports'
  def index
    @selected_to_date = @selected_from_date = Date.today   
    glances_search
  end

  def glances_search
    @all_terminals = all_terminals
    get_sales_data
    iterate_results
    create_sales_per_hour_graph
  end

  def iterate_results
    @sales_per_hour = Hash.new { |h,k| h[k] = 0.0 }
    @items_per_hour = Hash.new { |h,k| h[k] = 0 }
    @top_selling_items = Hash.new { |h,k| h[k] = ["",0,0.0] }
    for order in @orders
      #sales per hour for graph
      calculate_sales_per_hour order
      #top selling items
      parse_order order
    end
    @top_selling_items = @top_selling_items.sort_by { |k, v| v[1] }.reverse.first(5)
    logger.info "TOPS #{@top_selling_items}"
#    logger.info "SALES PER HOUR #{@sales_per_hour.keys.sort}"
#    logger.info "SALES PER HOUR #{@sales_per_hour.sort_by { |k, v| k }}"
#    logger.info "HASH #{@sales_per_hour}"
  end

  def calculate_sales_per_hour order
    order_hour = order.created_at.strftime('%Y-%m-%d %H:%M:%S').to_time.hour
    @sales_per_hour[order_hour] += order.total
    @sales_per_hour[order_hour] = @sales_per_hour[order_hour].round(2)
    #items table
    @items_per_hour[order_hour] += 1
  end

  def parse_order order
    @order_items = OrderItem.find_all_by_order_id order.id
    for order_item in @order_items
      @top_selling_items[order_item.product_id][0] = order_item.product_name
      @top_selling_items[order_item.product_id][1] += order_item.quantity.to_i
      @top_selling_items[order_item.product_id][2] += order_item.total_price
    end
  end

  def create_sales_per_hour_graph
    @graph = LazyHighCharts::HighChart.new('graph') do |f|
      f.options[:chart][:defaultSeriesType] = "line"
      f.options[:chart][:animation] = true
      f.options[:title][:text] = "Sales Per Hour"
      f.options[:xAxis][:categories] = @sales_per_hour.keys.sort
      f.options[:yAxis][:min] = "0"
      f.options[:yAxis][:max] = @sales_per_hour.values.max_by { |obj| obj }
      f.options[:yAxis][:title][:text] = "Total (Euros)"
      f.series(:name=>'Sales', :data=>@sales_per_hour.sort_by { |k, v| k } )
    end
  end

  def get_sales_data
    #must push the "to" date forward a day to match today
    if params[:search] and params[:search][:created_at_lte] and !params[:search][:created_at_lte].empty?
     @selected_to_date = params[:search][:created_at_lte]
     params[:search][:created_at_lte] = @selected_to_date.to_date.tomorrow.midnight
    end
    @orders = Order.search(params[:search])
  end
end