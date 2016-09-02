(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig)
        .config(routeConfig)
        .config(animationConfig)
        .config(localStorageConfig)
        .config(ionicConfig)
        .config(httpConfig)
        .config(imgCache);

    function appConfig($compileProvider) {

        console.info('Angular bootstrapped');

        // Remove angular debug info in DOM when compiling for production
        $compileProvider.debugInfoEnabled(false);

        // You may enable them manually by executing in your console: `angular.reloadWithDebugInfo()`

        // If you want a permanent change, modify the above line:
        // ```
        // $compileProvider.debugInfoEnabled(env === 'dev');
        // ```
        // Don't forget to inject the env constant.

        // Empty the hash before the router is started in order to guaranty we will execute the boot process before any controller.
        window.location.hash = '';
    }

    function routeConfig($stateProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'common/layout/layout.jade'
            })

            /////////////////////////////////////////////////////////////////

            .state('app.tab1List', {
                url: '/tab1',
                views: {
                    'app-tab1': {
                        templateUrl: 'tab1/list/tab1-list.jade',
                        controller: 'Tab1ListController as vm'
                    }
                }
            })
            // Open a modal (see #routeConfig app.run.js)
            .state('app.tab1DetailInModal', {
                url: '/tab1',
                params: {
                    item: {}
                }
            })

            /////////////////////////////////////////////////////////////////

            .state('app.tab2', {
                url: '/tab2',
                views: {
                    'app-tab2': {
                        templateUrl: 'tab2/list/tab2-list.jade',
                        controller: 'Tab2ListController as vm'
                    }
                }
            })

            /////////////////////////////////////////////////////////////////

            .state('app.tab3', {
                url: '/tab3',
                views: {
                    'app-tab3': {
                        templateUrl: 'tab3/tab3-list.jade',
                        controller: 'Tab3ListController as vm'
                    }
                }
            })

            /////////////////////////////////////////////////////////////////

            .state('app.settings', {
                url: '/settings',
                views: {
                    'app-settings': {
                        templateUrl: 'setting/setting-list.jade',
                        controller: 'SettingListController as vm'
                    }
                }
            });

        console.debug('States defined');

    }

    function animationConfig($animateProvider){
        // By default, the $animate service will check for animation styling
        // on every structural change. This requires a lot of animateFrame-based
        // DOM-inspection. However, we can tell $animate to only check for
        // animations on elements that have a specific class name RegExp pattern
        // present. In this case, we are requiring the "animated" class.
        // https://docs.angularjs.org/guide/animations
        // http://www.bennadel.com/blog/2935-enable-animations-explicitly-for-a-performance-boost-in-angularjs.htm
        $animateProvider.classNameFilter( /\banimated\b/ );
    }

    // All keys in local storage will have the prefix 'lrnion'.
    function localStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('app');
    }

    // Ionic defaults
    function ionicConfig($ionicConfigProvider) {
        $ionicConfigProvider.spinner.icon('dots');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.views.maxCache(3);
    }

    function httpConfig($httpProvider) {
        // Performance optimisation: batch multiple $http responses into one $digest when possible
        // http://blog.thoughtram.io/angularjs/2015/01/14/exploring-angular-1.3-speed-up-with-applyAsync.html
        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('httpInterceptor');
    }

    function imgCache(ImgCacheProvider, $compileProvider) {
        ImgCacheProvider.setOptions({
            debug: true,
            chromeQuota: 50 * 1024 * 1024,
            skipURIencoding: false,
            usePersistentCache: false
        });
        ImgCacheProvider.manualInit = true;
        // Add cdvfile scheme is angular whitelist for image sources.
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|cdvfile|filesystem|content|blob|ms-appx|ms-appx-web|x-wmapp0):|data:image\//);
    }

})();

