(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tab3ListController', Tab3ListController);

    function Tab3ListController($log) {

        var vm = this;
        vm.title = 'Tab3ListController';

        activate();

        ////////////////

        function activate() {
            $log.debug(vm.title + ' instantiated');
        }
    }

})();
