@config_file_found = true

#try read config file from home directory first
begin
  YAML_CONFIG_FILE = YAML.load_file("~/cluey/cluey_config.yml")
rescue
  @config_file_found = false
end

if !@config_file_found
  begin
    YAML_CONFIG_FILE = YAML.load_file("#{RAILS_ROOT}/config/custom_config.yml")
  rescue
    YAML_CONFIG_FILE = YAML.load_file("#{RAILS_ROOT}/config/default_custom_config.yml")
  end
end

CUSTOM_CONFIG = YAML_CONFIG_FILE[RAILS_ENV]

HTTP_BASIC_AUTH_USERNAME = CUSTOM_CONFIG["http_basic_auth_username"]
HTTP_BASIC_AUTH_PASSWORD = CUSTOM_CONFIG["http_basic_auth_password"]

USE_S3 = CUSTOM_CONFIG["use_s3"]
S3_BUCKET_NAME = CUSTOM_CONFIG["s3_bucket_name"]
S3_ACCESS_KEY_ID = CUSTOM_CONFIG["s3_access_key_id"]
S3_SECRET_ACCESS_KEY = CUSTOM_CONFIG["s3_secret_access_key"]

if USE_S3 
  PAPERCLIP_STORAGE_OPTIONS = {:storage => :s3,
    :bucket => S3_BUCKET_NAME,
    :s3_credentials => {
      :access_key_id => S3_ACCESS_KEY_ID,
      :secret_access_key => S3_SECRET_ACCESS_KEY
    }
  }
else
  PAPERCLIP_STORAGE_OPTIONS = {}
end

require "net/http"
require "uri"