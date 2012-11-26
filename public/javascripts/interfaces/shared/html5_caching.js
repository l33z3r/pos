var cacheDownloading = false;

// Get a short-hand for our application cache object.
var appCache = window.applicationCache;
 
// Create a cache properties object to help us keep track of
// the progress of the caching.
var cacheProperties = {
    filesDownloaded: 0,
    totalFiles: 0
};
    
//bind to cache events
// Bind to online/offline events.
$(window).bind(
    "online offline",
    function(event) {
        setConnectionStatus(navigator.onLine);
    }
);
 
// List for checking events. This gets fired when the browser
// is checking for an udpated manifest file or is attempting
// to download it for the first time.
$(appCache).bind(
    "checking",
    function(event) {
        console.log("Checking for manifest");
    }
    );
 
// This gets fired if there is no update to the manifest file
// that has just been checked.
$(appCache).bind(
    "noupdate",
    function(event) {
        console.log("No cache updates");
    }
    );
 
// This gets fired when the browser is downloading the files
// defined in the cache manifest.
$(appCache).bind(
    "downloading",
    function(event) {
        console.log("Downloading cache");
        
        //show on interface that cache is stale and download is happening
        cacheDownloading = true;
        cacheDownloadStarted();
        
        // Get the total number of files in our manifest.
        getTotalFiles();
    }
    );
 
// This gets fired for every file that is downloaded by the
// cache update.
$(appCache).bind(
    "progress",
    function(event) {
        // Show the download progress.
        displayProgress();
    }
    );
 
// This gets fired when all cached files have been
// downloaded and are available to the application cache.
$(appCache).bind(
    "cached",
    function(event) {
        console.log("All files downloaded");
        
        //this is the first dl of the cache so we must do some things
        setStatusMessage("Sales interface has been saved for offline use");
        cacheDownloading = false;
        cacheDownloadReset();
    }
    );
 
// This gets fired when new cache files have been downloaded
// and are ready to replace the *existing* cache. The old
// cache will need to be swapped out.
$(appCache).bind(
    "updateready",
    function(event) {
        console.log("New cache available");
 
        // Swap out the old cache.
        appCache.swapCache();
        cacheDownloadReset();
        cacheDownloading = false;
        indicateActionRequired(alertCacheReloadRequest);
    }
    );
 
// This gets fired when the cache manifest cannot be found.
$(appCache).bind(
    "obsolete",
    function(event) {
        console.log("Manifest cannot be found");
    }
    );
 
// This gets fired when an error occurs
$(appCache).bind(
    "error",
    function(event) {
        //if we are offline, there is no need to display the error notice
        if(appOnline) {
            niceAlert("An error occurred while downloading the latest cache. You may be using a stale version. Try reloading the app");
        
            //reset some things
            cacheDownloading = false;
            cacheDownloadReset();
        }
    }
    );        
 
// I get the total number of files in the cache manifest.
// I do this by manually parsing the manifest file.
function getTotalFiles() {
    // First, reset the total file count and download count.
    cacheProperties.filesDownloaded = 0;
    cacheProperties.totalFiles = 0;
 
    // Now, grab the cache manifest file.
    $.ajax({
        type: "get",
        url: "./cache_manifest",
        dataType: "text",
        cache: false,
        success: function(content) {
            // Strip out the non-cache sections.
            // NOTE: The line break here is only to prevent
            // wrapping in the BLOG.
            content = content.replace(
                new RegExp(
                    "(NETWORK|FALLBACK):" +
                    "((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)",
                    "gi"
                    ),
                ""
                );
 
            // Strip out all comments.
            content = content.replace(
                new RegExp( "#[^\\r\\n]*(\\r\\n?|\\n)", "g" ),
                ""
                );
 
            // Strip out the cache manifest header and
            // trailing slashes.
            content = content.replace(
                new RegExp( "CACHE MANIFEST\\s*|\\s*$", "g" ),
                ""
                );
 
            // Strip out extra line breaks and replace with
            // a hash sign that we can break on.
            content = content.replace(
                new RegExp( "[\\r\\n]+", "g" ),
                "#"
                );
 
            // Get the total number of files.
            var totalFiles = content.split( "#" ).length;
 
            // Store the total number of files. Here, we are
            // adding one for *THIS* file, which is cached
            // implicitly as it points to the manifest.
            cacheProperties.totalFiles = (totalFiles + 1);
        }
    });
}
 
// I display the download progress.
function displayProgress() {
    // Increment the running total.
    cacheProperties.filesDownloaded++;
 
    // Check to see if we have a total number of files.
    if (cacheProperties.totalFiles) {
        var percentComplete = Math.round(((cacheProperties.filesDownloaded * 100.0)/cacheProperties.totalFiles));
        
        if(percentComplete > 100) {
            percentComplete = 100;
        }
        
        // We have the total number of files, so output the
        // running total as a function of the known total.
        $("#cache_status").text("Cache DL: " + percentComplete + "%");
    }
}

var cacheUpdatePollIntervalSeconds = 120;
var cacheUpdatePollIntervalMillis = cacheUpdatePollIntervalSeconds * 1000;

function startCacheUpdateCheckPoll() {
    setTimeout(cacheUpdateCheckPoll, cacheUpdatePollIntervalMillis);
}
  
function cacheUpdateCheckPoll() {
    if(appOnline && !cacheDownloading) {
        console.log("Checking for cache update");
       
        window.applicationCache.update();
    }

    setTimeout(cacheUpdateCheckPoll, cacheUpdatePollIntervalMillis);
}