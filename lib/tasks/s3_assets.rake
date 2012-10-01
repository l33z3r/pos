require 's3'
require 'digest/md5'
require 'mime/types'

namespace :assets do
  desc "Generate Cached Assets"
  task :cache => :environment do

    paths = ['public/javascripts/cache/', 'public/stylesheets/cache/']

    puts "-----> caching assets..."
  
    paths.each do |path|
      FileUtils.rm(Dir.glob(path + "*")) if File.exist?(path)
    end

    ActionController::Base.perform_caching = true

    session = ActionDispatch::Integration::Session.new(Rails.application)
    session.get('/build_assets')
  
    begin
      session.follow_redirect!
    rescue
      #whogivesaratsass
    end
  
    paths.each do |path|
      if File.exist?(path)
        Dir.glob(path + "*").each do |full_path|
          puts "----->  adding to index: #{full_path}"
          system("git add #{full_path}")
        end
      end
    end

    if %x[git diff-index HEAD].present?
      puts "-----> committing cached assets"
      system("git commit -m 'cache_assets'")
    else
      puts "-----> nothing to commit"
    end

    puts "-----> done"
  end
  
  #http://ariejan.net/2011/01/01/rake-task-to-sync-your-assets-to-amazon-s3cloudfront
  desc "Deploy selected assets in public folder to S3"
  task :sync do

    prod_env = ENV['prod_env']
    require "#{RAILS_ROOT}/config/initializers/custom"

    AWS_ACCESS_KEY_ID = YAML_CONFIG_FILE[prod_env]["s3_access_key_id"]
    AWS_SECRET_ACCESS_KEY = YAML_CONFIG_FILE[prod_env]["s3_secret_access_key"]
    AWS_BUCKET = YAML_CONFIG_FILE[prod_env]["s3_public_bucket_name"]

    ## Use the `s3` gem to connect my bucket
    puts "== Uploading assets to S3/Cloudfront"

    service = S3::Service.new(
      :access_key_id => AWS_ACCESS_KEY_ID,
      :secret_access_key => AWS_SECRET_ACCESS_KEY)
    bucket = service.buckets.find(AWS_BUCKET)

    ## Needed to show progress
    STDOUT.sync = true

    #Select some files in the public directory to sync
    all_files = Dir.glob("public/images/**/*") | Dir.glob("public/javascripts/**/*") | Dir.glob("public/stylesheets/**/*") 
    all_files |= Dir.glob("public/firefox_extensions/**/*") | Dir.glob("public/jqtouch") | Dir.glob("public/files/**/*") | Dir.glob("public/sounds/**/*")
    all_files << "public/404.html"
    all_files << "public/422.html" 
    all_files << "public/500.html" 
    all_files << "public/favicon.ico" 
    all_files << "public/robots.txt"
    
    total_files_count = all_files.size
    upload_file_count = 0
    percent_complete = 0
    
    puts "-----> Syncing #{total_files_count} files with S3"
    
    all_files.each do |file|
      upload_file_count += 1
      
      percent_complete = (upload_file_count * 100)/total_files_count
      
      ## Only upload files, we're not interested in directories
      if File.file?(file)
        ## Slash 'public/' from the filename for use on S3
        remote_file = file.gsub("public/", "")

        ## Try to find the remote_file, an error is thrown when no
        ## such file can be found, that's okay.  
        begin
          obj = bucket.objects.find_first(remote_file)
        rescue
          obj = nil
        end

        ## If the object does not exist, or if the MD5 Hash / etag of the 
        ## file has changed, upload it.
        
        puts "Syncing #{remote_file} (#{upload_file_count} of #{total_files_count}) (#{percent_complete}%)..."
        
        if !obj || (obj.etag != Digest::MD5.hexdigest(File.read(file)))
          puts "Uploading file..."

          ## Simply create a new object, write the content and set the proper 
          ## mime-type. `obj.save` will upload and store the file to S3.
          obj = bucket.objects.build(remote_file)
          obj.content = open(file)
          
          if file.ends_with? ".js"
            obj.content_type = "text/javascript"
          else
            obj.content_type = MIME::Types.type_for(file).to_s
          end
          
          obj.save
        else
          puts "No change in file... skipping"
        end
      end
    end
    STDOUT.sync = false # Done with progress output.

    puts
    puts "== Done syncing assets"
  end
end