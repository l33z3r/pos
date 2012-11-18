class JavascriptsController < ApplicationController
  def init_touch_draggable
    @display = current_outlet.displays.find(params[:id])
  end
end
