CUSTOM_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/custom_config.yml")[RAILS_ENV]

DO_HTTP_BASIC_AUTH = CUSTOM_CONFIG["do_http_basic_auth"]
HTTP_BASIC_AUTH_USERNAME = CUSTOM_CONFIG["http_basic_auth_username"]
HTTP_BASIC_AUTH_PASSWORD = CUSTOM_CONFIG["http_basic_auth_password"]