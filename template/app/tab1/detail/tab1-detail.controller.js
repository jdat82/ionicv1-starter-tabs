(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tab1DetailController', Tab1DetailController);

    function Tab1DetailController($log, $stateParams, $scope) {

        var vm = this, unlisten = null;
        vm.title = 'Tab1DetailController';
        vm.item = $stateParams.item;
        vm.doSomething = doSomething;
        vm.remove = remove;

        activate();

        ////////////////

        function activate() {
            $log.debug(vm.title + ' instantiated');
            unlisten = $scope.$parent.$on('modal.shown', doSomething);
        }

        // Request the first five comics for this character.
        function doSomething() {
            unlisten();
            // Do something            
        }

        function remove() {
            // Little subtlety.
            // For simplicity sake, the modal load a template which define its own controller in the template (this one).
            // As ionicModal create a scope automatically if not provided, it is automatically the parent of the one created for this controller.
            // You should know too that ionicModal will register the created instance as a property of the scope.
            // Thus our parent scope possessing a reference to our modal instance.
            $scope.$parent.modal.remove();
        }

    }

})();

