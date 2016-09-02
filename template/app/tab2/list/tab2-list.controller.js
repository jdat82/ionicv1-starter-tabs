(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tab2ListController', Tab2ListController);

    function Tab2ListController($log) {

        var vm = this;
        vm.title = 'Tab2ListController';

        activate();

        ////////////////

        function activate() {
            $log.debug(vm.title + ' instantiated');
        }

    }

})();
