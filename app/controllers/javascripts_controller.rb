class JavascriptsController < ApplicationController
  def init_touch_draggable
    @display = Display.find(params[:id])
  end
end
