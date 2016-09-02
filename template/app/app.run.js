(function () {
    'use strict';

    angular
        .module('app')
        .run(configureCordovaPlugins)
        .run(setRouteConfig)
        .run(setCustomLogs)
        .run(addGlobals)
        .run(setHttpDefaultCache)
        .run(setRestConfig)
        .run(handleAdjustPanKeyboardMode)
        .run(applySettings)
        .run(setTracker)
        .run(boot);

    //////////////////////

    function configureCordovaPlugins($cordovaStatusbar) {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(false);
        }

        // Style the status bar
        var style = _.get($cordovaStatusbar, 'style');
        style && style(1);
        var styleHex = _.get($cordovaStatusbar, 'styleHex');
        styleHex && styleHex('#e53935');

    }

    // It is not possible with the current version of ui-router to cancel a navigation in the onEnter function of a state definition.
    // Thus, if you open a modal in that function, you will always navigate somewhere. We don't want that.
    // We want to prevent navigation and open a modal instead. So why create a state in the first place ?
    // Because I want to centralize navigation entries and their params. Some times we will navigate normally and some times we will
    // open a modal instead. Next version of ui-router might be smarter.
    function setRouteConfig($ionicModal, $rootScope, $log, $stateParams) {

        $rootScope.$on('$stateChangeStart', route);

        ///////////

        function route(event, toState, toParams) {

            var stateName = toState.name;

            if (!_.includes(stateName, 'Modal')) return;

            // Prevent state navigation: taking control from here
            event.preventDefault();
            // Copy params given to state in $stateParams in order to retrieve them in modals.
            // As we are cancelling navigation, the ui router will not set $stateParams. That's too bad because I like that pattern.
            _.assign($stateParams, toParams);

            var modalOptions = {
                animation: 'slide-in-right'
            };

            switch (stateName) {
                case 'app.tab1DetailInModal':
                    return $ionicModal.fromTemplateUrl('tab1/detail/tab1-detail.jade', modalOptions).then(show);
            }

            /////////

            function show(modal) {
                modal.show();
            }
        }
    }

    // Help to detect in console which states have been invoked.
    function setCustomLogs($rootScope, $log) {
        $rootScope.$on('$stateChangeStart', logViewName);

        function logViewName(event, toState, toParams) {
            $log.info('Entering state', toState.name, 'with parameters:', toParams);
        }
    }

    function setHttpDefaultCache($log, $http, CacheFactory, defaultCacheName) {

        // In unit tests, we will run this for each spec.
        if (CacheFactory.get(defaultCacheName)) return;

        var options = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 week
            deleteOnExpire: 'passive', // Cache will do nothing when an item expires.
            // Expired items will remain in the cache until requested, at which point they are removed, and undefined is returned.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        };

        $log.debug('Created a default cache for HTTP requests with properties:', options);

        $http.defaults.cache = new CacheFactory('defaultCache', options);
    }

    // Restangular configuration
    function setRestConfig(Restangular, apiEndpoint) {

        // Temporary hack: Restangular is not compatible with Lodash v4.
        _.contains = _.includes;

        // All xhr requests url will have this prefix
        Restangular.setBaseUrl(apiEndpoint);

        // All xhr requests will contain the apikey parameter
        // Restangular.setDefaultRequestParams({apikey: apiKey});

        // Define which property in JSON responses contains the self link
        // Restangular.setRestangularFields({
        //     selfLink: 'resourceURI'
        // });

        // What we need to do everytime we request an API
        // Restangular.addResponseInterceptor(function (data, operation) {
        // });

    }

    function addGlobals($rootScope, $window) {
        $rootScope.isCordova = ionic.Platform.isWebView();
        $rootScope.isFileUrl = _.startsWith($window.location.origin, 'file:');
    }

    // Will add a simple div which height is the keyboard height in the scroll area
    // in order to reveal what is behind. Makes sense only if the native keyboard behavior
    // is to appears on top and do not resize webview; i.e only for android with
    // `windowSoftInputMode="adjustPan"`.
    function handleAdjustPanKeyboardMode($ionicScrollDelegate) {
        if (!ionic.Platform.isAndroid()) return;

        var $artificialItem;

        window.addEventListener('native.keyboardshow', revealContentBehindKeyboard);
        window.addEventListener('native.keyboardhide', removeArtificialItem);

        ///////////////

        function revealContentBehindKeyboard(e) {
            var $scrollContent = angular.element($ionicScrollDelegate.getScrollView().__content);
            if ($artificialItem == null) {
                $artificialItem = angular.element('<div></div>').css('height', e.keyboardHeight + 'px');
            }
            $scrollContent.append($artificialItem);
        }

        function removeArtificialItem() {
            $artificialItem.detach();
        }
    }

    // Apply saved settings at startup.
    function applySettings(settingService) {
        settingService.apply();
    }

    // Set up Google Analytics
    function setTracker($log, trackerId, $rootScope, $cordovaGoogleAnalytics) {

        $cordovaGoogleAnalytics.startTrackerWithId(trackerId);
        '@@env' === 'dev' && $cordovaGoogleAnalytics.debugMode();

        // Now we can start tracking pages
        $rootScope.$on('$stateChangeSuccess', trackView);

        ////////////////

        function trackView(event, toState) {
            var url = toState.name;
            $cordovaGoogleAnalytics.trackView(url).then(beaconSent).catch(beaconCrashed);

            ////////////////

            function beaconSent() {
                $log.info('GA beacon sent for url `' + url + '`');
            }

            function beaconCrashed(err) {
                $log.error('GA beacon crashed for url `' + url + '` with error:', err);
            }
        }
    }

    // Boot workflow that will initialize mandatory components, go to the home page and then hide the splashscreen.
    function boot($state, $cordovaSplashscreen, $timeout, ImgCache, $rootScope, $log, $ionicPopup) {
        initImgCache()
            .catch(explain)
            .then(goHome)
            .finally(hideSplash);

        /////////////

        function initImgCache() {
            ImgCache.$init();
            return ImgCache.$promise;
        }

        function explain() {
            var options = {
                title: 'Invalid state',
                template: 'Please allow access to the filesystem if you want to use this app.',
                cssClass: 'alert-popup',
                okType: 'button-assertive'
            };
            $ionicPopup.alert(options).then(ionic.Platform.exitApp);
        }

        function goHome() {
            $log.info('APP READY');
            $rootScope.ready = true;
            return $state.go('app.tab1List');
        }

        function hideSplash() {
            return $timeout($cordovaSplashscreen.hide, 1000, false);
        }

    }


})();
