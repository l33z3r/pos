#when sending a big order we get some error relating to too many key/value pairs being sent as params
#this patch to rack solves the issue: http://stackoverflow.com/questions/9122411/rails-javascript-too-many-parameter-keys-whats-a-good-way-to-normalize-f
if Rack::Utils.respond_to?("key_space_limit=")
  #one hundred million
  Rack::Utils.key_space_limit = 1000000000
end

@config_file_found = true

#try read config file from home directory first
begin
  YAML_CONFIG_FILE = YAML.load_file("#{File.expand_path('~')}/cluey/cluey_config.yml")
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
S3_USER_UPLOADS_BUCKET_NAME = CUSTOM_CONFIG["s3_user_uploads_bucket_name"]
S3_USER_UPLOADS_ASSET_HOST = CUSTOM_CONFIG["s3_user_uploads_asset_host"]
S3_ACCESS_KEY_ID = CUSTOM_CONFIG["s3_access_key_id"]
S3_SECRET_ACCESS_KEY = CUSTOM_CONFIG["s3_secret_access_key"]
DAYS_OF_THE_WEEK = %w[Sunday Monday Tuesday Wednesday Thursday Friday Saturday]

if USE_S3 
  PAPERCLIP_STORAGE_OPTIONS = {
    :storage => :s3,
    :s3_protocol => "https",
    :bucket => S3_USER_UPLOADS_BUCKET_NAME,
    :s3_credentials => {
      :access_key_id => S3_ACCESS_KEY_ID,
      :secret_access_key => S3_SECRET_ACCESS_KEY
    }
  }
else
  PAPERCLIP_STORAGE_OPTIONS = {}
end

GOOGLE_TRANSLATE_API_KEY = CUSTOM_CONFIG['google_translate_api_key']

#recaptcha
Recaptcha.configure do |config|
  config.public_key  = CUSTOM_CONFIG['recaptcha_public_key']
  config.private_key = CUSTOM_CONFIG['recaptcha_private_key']
end

APP_DOMAIN = CUSTOM_CONFIG['domain_name']
APP_PORT = CUSTOM_CONFIG['domain_port'] ? ":" + CUSTOM_CONFIG['domain_port'].to_s : ""

DEFAULT_TIME_ZONE_NAME = Time.zone.name

require "net/http"
require "uri"
require 'iconv'