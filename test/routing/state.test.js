//
//  @file state module its
//  @copyright Digital Living Software Corp. 2014-2016


describe('pipState', function() {
    describe('config block', function () {
        var pipTranslateProvider;

        describebeforeEach(module('pipState', function (_pipTranslateProvider_) {
            pipTranslateProvider = _pipTranslateProvider_;
        }));

    });

    describe('run block', function () {
        var $rootScope,
            $state,
            service,
            provider;

        beforeEach(module('pipState', function (pipStateProvider) {
            provider = pipStateProvider;
        }));

        beforeEach(inject(function (pipState, _$rootScope_, _$state_) {
            service = pipState;
            $state = _$state_;
            $rootScope = _$rootScope_;
        }));

        it('"$stateChangeError" event', function (done) {
            $rootScope.$broadcast('$stateChangeError', {name: 'error_state'});

            assert.isFalse($rootScope.$routing, '$rootScope.$routing should be false');

            $rootScope.$routing = undefined;

            done();
        });

        it('"$stateChangeSuccess" event', function (done) {
            $rootScope.$broadcast('$stateChangeSuccess', {
                name: 'success_state',
                url: '/success'
            }, {}, {name: 'previous_state', url: '/previous'}, {});

            assert.isFalse($rootScope.$routing, '$rootScope.$routing should be false');

            assert.deepEqual($rootScope.$state, {
                name: 'success_state',
                url: '/success',
                params: {}
            }, '$rootScope.$state should be equal to current state');

            assert.deepEqual($rootScope.$prevState, {
                name: 'previous_state',
                url: '/previous',
                params: {}
            }, '$rootScope.$prevState should be equal to previous state');

            $rootScope.$routing = undefined;

            done();
        });

        it('"$stateChangeStart" event', function (done) {
            var toState = {
                    name: 'success_state',
                    url: '/success',
                    auth: true
                },
                fromState = {
                    name: 'previous_state',
                    url: '/previous'
                },
                toStateParams = {},
                fromStateParams = {};

            //service.redirect = sinon.spy();

            $rootScope.$broadcast('$stateChangeStart', toState, toStateParams, fromState, fromStateParams);

            //assert.strictEqual($rootScope.$routing, true);
            //assert.strictEqual(service.redirect.called, true);

            $rootScope.$routing = undefined;

            done();
        });
    });

    describe('provider block', function () {
        var $rootScope,
            $state,
            service,
            provider;

        beforeEach(module('pipState', function (pipStateProvider) {
            provider = pipStateProvider;
        }));

        beforeEach(inject(function (pipState, _$rootScope_, _$state_) {
            service = pipState;
            $state = _$state_;
            $rootScope = _$rootScope_;
        }));

        it('redirect return true', function (done) {
            var toState = {
                    name: 'success_state',
                    url: '/success',
                    auth: true
                },
                fromState = {
                    name: 'previous_state',
                    url: '/previous'
                },
                toStateParams = {},
                event = {};

            // Add to redirectedStates table
            provider.redirect(fromState.name, toState.name);

            var result = $state.redirect(event, fromState, toStateParams, $rootScope);

            assert.isTrue($rootScope.$routing, '$rootScope.$routing should be true');
            assert.isTrue(result, '$state.redirect should return true if toState is not null, undefined or false');

            $rootScope.$routing = undefined;

            done();
        });

        it('redirect throw error', function (done) {
            var toState = {
                    name: function () {
                        return null;
                    },
                    url: '/success',
                    auth: true
                },
                fromState = {
                    name: 'previous_state',
                    url: '/previous'
                },
                toStateParams = {},
                event = {};

            // Add to redirectedStates table
            provider.redirect(fromState.name, toState.name);

            assert.throws(function () {
                return $state.redirect(event, fromState, toStateParams, $rootScope);
            }, /Redirected toState cannot be null/, '$state.redirect should throws error if toState is null');

            assert.isFalse($rootScope.$routing, '$rootScope.$routing should be false');

            $rootScope.$routing = undefined;

            done();
        });

        it('redirect return false', function (done) {
            var toState = {
                    name: 'success_state',
                    url: '/success',
                    auth: true
                },
                fromState = {
                    name: 'previous_state',
                    url: '/previous'
                },
                toStateParams = {},
                event = {};

            var result = $state.redirect(event, fromState, toStateParams, $rootScope);

            assert.isTrue($rootScope.$routing, '$rootScope.$routing should be true');
            assert.isFalse(result, '$state.redirect should return false if toState is null, undefined or false');

            $rootScope.$routing = undefined;

            done();
        });
    });

});