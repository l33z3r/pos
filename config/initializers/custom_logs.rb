#an exception logger
EXCEPTION_LOGGER = Logger.new('log/errors.log')

#this will be the default logger that will do conditional logging,
#we use it to seperate the call_home action
class NoisyLogger < Rails::Rack::Logger
  def initialize app, opts = {}
    @default_log = Rails.logger

    # Put the noisy log in the same directory as the default log.
    @noisy_log = Logger.new Rails.root.join('log', 'noisy.log')

    @app = app
    @opts = opts
    @opts[:noisy] = Array @opts[:noisy]

    super app
  end

  def call env
    if @opts[:noisy].include? env['PATH_INFO']
      logfile = @noisy_log
    else
      logfile = @default_log
    end

    # What?! Why are these all separate?
    ActiveRecord::Base.logger = logfile
    ActionController::Base.logger = logfile
    Rails.logger = logfile

    # The Rails::Rack::Logger class is responsible for logging the
    # 'starting GET blah blah' log line. We need to call super here (as opposed
    # to @app.call) to make sure that line gets output. However, the
    # ActiveSupport::LogSubscriber class (which Rails::Rack::Logger inherits
    # from) caches the logger, so we have to override that too
    @logger = logfile

    super
  end
end

#swap out the default logger for our custom one
Pos::Application.config.middleware.swap(
  Rails::Rack::Logger, NoisyLogger, :noisy => 
    ["/call_home.js", "/last_receipt_for_terminal.js", "/last_receipt_for_server.js", "/last_receipt_for_table.js", "/blank_receipt_for_print"]
)