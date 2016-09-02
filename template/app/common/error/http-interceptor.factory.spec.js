describe('httpInterceptor', function() {

    var Err, fooService, $httpBackend;

    beforeEach(inject(function ($injector) {
        Err = $injector.get('Err');
        fooService = $injector.get('fooService');
        $httpBackend = $injector.get('$httpBackend');
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send an offline error', function () {
        $httpBackend.expectGET(/\/comics/).respond(0);
        fooService.fakeCall()
            .then(function(){throw 'Should have failed';})
            .catch(function(err){
                expect(err).toEqual(jasmine.any(Err));
                expect(err.code).toBe(1001);
                expect(err.ui).toBe(true);
            });
        $httpBackend.flush();
    });

    it('should send a timeout error', function () {
        $httpBackend.expectGET(/\/comics/).respond(-1);
        fooService.fakeCall()
            .then(function(){throw 'Should have failed';})
            .catch(function(err){
                expect(err).toEqual(jasmine.any(Err));
                expect(err.code).toBe(1000);
                expect(err.ui).toBe(true);
            });
        $httpBackend.flush();
    });

    it('should send a generic error', function () {
        $httpBackend.expectGET(/\/comics/).respond(500, {}, {}, 'Go away');
        fooService.fakeCall()
            .then(function(){throw 'Should have failed';})
            .catch(function(err){
                expect(err).toEqual(jasmine.any(Object));
                expect(err.status).toBe(500);
                expect(err.statusText).toBe('Go away');
            });
        $httpBackend.flush();
    });

});
