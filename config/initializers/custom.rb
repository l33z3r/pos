CUSTOM_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/custom_config.yml")[RAILS_ENV]

DO_HTTP_BASIC_AUTH = CUSTOM_CONFIG["do_http_basic_auth"]
HTTP_BASIC_AUTH_USERNAME = CUSTOM_CONFIG["http_basic_auth_username"]
HTTP_BASIC_AUTH_PASSWORD = CUSTOM_CONFIG["http_basic_auth_password"]

S3_BUCKET_NAME = CUSTOM_CONFIG["s3_bucket_name"]
S3_ACCESS_KEY_ID = CUSTOM_CONFIG["s3_access_key_id"]
S3_SECRET_ACCESS_KEY = CUSTOM_CONFIG["s3_secret_access_key"]