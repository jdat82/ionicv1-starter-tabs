(function () {
    'use strict';

    angular
        .module('app')
        .factory('fooService', factory);

    function factory($q, $http) {

        var service = {
            findAll: findAll,
            fakeCall: fakeCall
        };

        return service;

        ///////////////

        function findAll() {
            var items = [{
                id:1,
                name: 'Deadpool',
                thumbnailUrl: 'http://i.annihil.us/u/prod/marvel/i/mg/9/90/5261a86cacb99.jpg'
            }];
            return $q.when(items);
        }

        function fakeCall(){
            // When possible you should use a library like Restangular instead of direct $http calls.
            return $http.get('/comics');
        }

    }

})();

