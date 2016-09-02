(function () {
    'use strict';

    angular
        .module('app')
        .factory('utils', utils);

    // As expected, helper functions.
    function utils($log, $q) {

        var service = {
            cacheFile: cacheFile,
            convertLocalFileSystemURL: convertLocalFileSystemURL
        };
        return service;

        ////////////////

        // Cache an image on disk from a source url.
        // Returns a promise. The resolve callback receive a cached url.
        // The reject callback receive the source url.
        function cacheFile(srcUrl) {
            return $q(function (resolve, reject) {
                if (!srcUrl) {
                    reject(srcUrl);
                    return;
                }
                ImgCache.getCachedFileURL(srcUrl, fileAlreadyInCache, cacheFile);
                /////////////
                function fileAlreadyInCache(providedUrl, cachedUrl) {
                    $log.debug('%s already in cache: %s', providedUrl, cachedUrl);
                    resolve(cachedUrl);
                }

                function cacheFile(providedUrl) {
                    ImgCache.cacheFile(providedUrl, fileInCacheNow, fallbackToOnlineUrl);
                }

                function fileInCacheNow(cachedUrl) {
                    $log.debug('%s just cached: %s', srcUrl, cachedUrl);
                    resolve(cachedUrl);
                }

                function fallbackToOnlineUrl() {
                    $log.warn('Failed to cache %s', srcUrl);
                    reject(srcUrl);
                }
            });
        }

        // Convert a cordova url (`cdvfile://`) into a standard file system url.
        function convertLocalFileSystemURL(url) {
            return $q(function (resolve, reject) {
                resolveLocalFileSystemURL(url, success, reject);
                //////////
                function success(entry) {
                    var nativeUrl = entry.toURL();
                    $log.debug('Converting from cordova url ` %s ` to native url : ` %s ` ', url, nativeUrl);
                    resolve(nativeUrl);
                }
            });
        }
    }

})();


