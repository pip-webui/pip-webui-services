//
//  @file timer module its
//  @copyright Digital Living Software Corp. 2014-2016


describe('pipTimer', function() {

    this.timeout(1000000);

    var
        AUTO_PULL_CHANGES_TIMEOUT = 60000,
        AUTO_UPDATE_PAGE_TIMEOUT = 15000;

    describe('service block', function () {
        var $rootScope,
            $interval,
            service;

        beforeEach(module('pipTimer'));

        beforeEach(inject(function (pipTimer, _$rootScope_, _$interval_) {
            service = pipTimer;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
        }));

        it('start and stop timer', function (done) {
            service.start();

            assert.isTrue(service.isStarted(), "after start service.isStarted() should return true");

            service.stop();
            assert.isFalse(service.isStarted(), "after stop service.isStarted() should return false");

            done();
        });

        it('broadcast intervals', function (done) {
            var spy = sinon.spy($rootScope, '$broadcast');
            service.start();

            // + 15 sec
            $interval.flush(AUTO_UPDATE_PAGE_TIMEOUT);
            assert(spy.calledWith('pipAutoUpdatePage'));
            assert.equal(spy.callCount, 1);

            // + 45 sec (60 - 15)
            $interval.flush(AUTO_PULL_CHANGES_TIMEOUT - AUTO_UPDATE_PAGE_TIMEOUT);
            assert(spy.calledWith('pipAutoPullChanges'));
            // 60 / 15 + 60 / 60 = 5
            assert.equal(spy.callCount, 5);

            service.stop();
            done();
        });

    });

});