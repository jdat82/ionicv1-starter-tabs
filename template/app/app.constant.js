(function () {
    'use strict';

    angular
        .module('app')
        // Lodash for dependency injection
        .constant('_', _)
        // App version from package.json
        .constant('version', '@@version')
        .constant('stringify', stringify)
        // Google Analytics account ID
        .constant('trackerId', '@@trackerId')
        // Current environment (dev or dist)
        .constant('env', '@@env')
        // Backend endpoint
        .constant('apiEndpoint', '@@apiEndpoint')
        // HTTP cache name
        .constant('defaultCacheName', 'defaultCache');

    // Same as `JSON.stringify` but with indentation.
    function stringify(value) {
        return JSON.stringify(value, null, '    ');
    }

})();
