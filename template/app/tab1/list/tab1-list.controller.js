(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tab1ListController', Tab1ListController);

    function Tab1ListController($log, fooService, $scope) {

        var vm = this;
        vm.title = 'Tab1ListController';
        vm.items = [];

        activate();

        ////////////////

        function activate() {
            $log.debug(vm.title + ' instantiated');
            $scope.$on('$ionicView.loaded', search);
        }

        function search(){
            fooService.findAll().then(function(items){
                vm.items = items;
            });
        }

    }

})();
