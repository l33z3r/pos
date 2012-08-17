class CustomLogger < Rails::Rack::Logger
  def initialize(app, opts = {})
    @app = app
    @opts = opts
    @opts[:silenced] ||= []
  end

  def call(env)
    if @opts[:silenced].include?(env['PATH_INFO'])
      Rails.logger.silence do
        @app.call(env)
      end
    else
      super(env)
    end
  end
end

silenced_actions = ["/call_home.js", "/ping", "/last_receipt_for_terminal.js", "/last_receipt_for_server.js", "/last_receipt_for_table.js", "/blank_receipt_for_print"]

Rails.configuration.middleware.swap Rails::Rack::Logger, CustomLogger, :silenced => silenced_actions