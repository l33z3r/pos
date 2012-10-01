desc "cache assets"
task :cache_assets => :environment do

  paths = ['public/javascripts/cache/*', 'public/stylesheets/cache/*']

  puts "-----> caching assets..."
  paths.each do |path|
    puts "-----> #{path}"
  end

  paths.each do |path|
    FileUtils.rm(path) if File.exist?(path)
  end

  ActionController::Base.perform_caching = true

  session = ActionDispatch::Integration::Session.new(Rails.application)
  session.get('/build_assets')
  session.follow_redirect!

  paths.each do |path|
    if File.exist?(path)
      system("git add #{path}") ? true : fail
    end
  end

  if %x[git diff-index HEAD].present?
    puts "-----> committing cached assets"
    system("git commit -m 'cache_assets'") ? true : fail
  else
    puts "-----> nothing to commit"
  end

  puts "-----> done"
end


# RAILS_ROOT/lib/tasks/assets.rake
namespace :assets do
  desc 'Precompile assets and upload to S3'
  task :upload, [:noop] => ['assets:clean', 'assets:precompile'] do |_, args|
    args.with_defaults(noop: false)

    Fog.credentials_path = "#{Rails.root}/config/fog_credentials.yml"

    Dir.chdir("#{Rails.root}/public") do
      assets = FileList['assets',"assets/**/*"].inject({}) do |hsh, path|
        if File.directory? path
          hsh.update("#{path}/" => :directory)
        else
          hsh.update(path => OpenSSL::Digest::MD5.hexdigest(File.read(path)))
        end
      end
      raise 'public/assets is empty: aborting' if assets.size <= 1

      fog = Fog::Storage.new(provider: 'AWS')
      # Replace ASSETS_BUCKET with the name of the S3 bucket for storing assets
      bucket = fog.directories.get(ASSETS_BUCKET)

      assets.each do |file, etag|
        case etag
        when :directory
          puts "Directory #{file}"
          bucket.files.create(key: file, public: true) unless args[:noop]
        when bucket.files.get(file).try(:etag)
          puts "Skipping #{file} (identical)"
        else
          puts "Uploading #{file}"
          bucket.files.create(key: file, public: true, body: File.open(file), cache_control: "max-age=#{1.month.to_i}") unless args[:noop]
        end
      end

      bucket.files.each do |object|
        unless assets.has_key? object.key
          puts "Removing #{object.key} (no longer exists)"
          object.destroy unless args[:noop]
        end
      end
    end
  end
end