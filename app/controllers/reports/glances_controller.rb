class Reports::GlancesController < ApplicationController

  def index
    @all_terminals = all_terminals
    @graph = LazyHighCharts::HighChart.new('graph') do |f|
      f.options[:chart][:defaultSeriesType] = "line"
      f.options[:chart][:animation] = true
      f.options[:title][:text] = "Sales Per Hour"
      f.options[:xAxis][:categories] = ['9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
      f.options[:yAxis][:min] = "0"
      f.options[:yAxis][:max] = "100"
      f.options[:yAxis][:title][:text] = "Total (Euros)"
      f.series(:name=>'Sales', :data=>[3, 20, 43, 55, 14, 60, 71 ,37, 56,65,27,37,80,59,29,10])
    end
  end
end