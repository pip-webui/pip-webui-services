//
//  @file toasts module its
//  @copyright Digital Living Software Corp. 2014-2016


describe('pipToasts', function() {

    var
        SHOW_TIMEOUT = 20000,
        SHOW_TIMEOUT_NOTIFICATIONS = 20000;

    describe('service block', function () {
        var $rootScope,
            $mdToast,
            ngAudio,
            service;

        beforeEach(module('pipToasts'));

        beforeEach(inject(function (pipToasts, _$rootScope_, _$mdToast_, _ngAudio_) {
            ngAudio = _ngAudio_;
            service = pipToasts;
            $rootScope = _$rootScope_;
            $mdToast = _$mdToast_;
        }));

        //it('pre-load sounds', function (done) {
        //    console.log('loadSpy', loadSpy.callCount);
        //    assert.equal(loadSpy.callCount, 3);
        //});

        it('show notification', function (done) {

            var spy = sinon.spy($mdToast, 'show'),
                message = 'notification',
                actions = ['yes', 'no'],
                rightToast = {
                    type: 'notification',
                    message: message,
                    actions: actions,
                    successCallback: undefined,
                    cancelCallback: undefined,
                    duration: SHOW_TIMEOUT_NOTIFICATIONS
                };

            service.showNotification(message, actions);

            var object = {
                template: String()
                + '<md-toast class="md-action" style="height: initial; max-height: initial">'
                + '<p class="flex-var text-overflow rm8" ng-bind-html="message"></p>'
                + '<md-button ng-click="onAction(action)" class="flex-fixed lm8" aria-label="{{::action| translate}}"'
                + ' ng-repeat="action in actions">{{::action| translate}}</md-button>'
                + '</md-toast>',
                hideDelay: SHOW_TIMEOUT_NOTIFICATIONS,
                position: 'bottom left',
                controller: 'pipToastController',
                locals: {
                    toast: rightToast
                }
            };

            assert(spy.calledWithMatch(object), '$mdToast.show argument should be equal to this object');
            assert.equal(spy.callCount, 1);

            done();
        });

        it('show message', function (done) {

            var spy = sinon.spy($mdToast, 'show'),
                message = 'message',
                actions = ['ok'],
                rightToast = {
                    type: 'message',
                    message: message,
                    actions: actions,
                    successCallback: undefined,
                    cancelCallback: undefined
                };

            service.showMessage(message);

            var object = {
                template: String()
                + '<md-toast class="md-action" style="height: initial; max-height: initial">'
                + '<p class="flex-var text-overflow rm8" ng-bind-html="message"></p>'
                + '<md-button ng-click="onAction(action)" class="flex-fixed lm8" aria-label="{{::action| translate}}"'
                + ' ng-repeat="action in actions">{{::action| translate}}</md-button>'
                + '</md-toast>',
                hideDelay: SHOW_TIMEOUT,
                position: 'bottom left',
                controller: 'pipToastController',
                locals: {
                    toast: rightToast
                }
            };

            assert(spy.calledWithMatch(object), '$mdToast.show argument should be equal to this object');
            assert.equal(spy.callCount, 1);

            done();
        });

        it('show error', function (done) {

            var spy = sinon.spy($mdToast, 'show'),
                message = 'message',
                actions = ['ok'],
                rightToast = {
                    type: 'error',
                    message: message,
                    actions: actions,
                    successCallback: undefined,
                    cancelCallback: undefined
                };

            service.showError(message);

            var object = {
                template: String()
                + '<md-toast class="md-action" style="height: initial; max-height: initial">'
                + '<p class="flex-var text-overflow rm8" ng-bind-html="message"></p>'
                + '<md-button ng-click="onAction(action)" class="flex-fixed lm8" aria-label="{{::action| translate}}"'
                + ' ng-repeat="action in actions">{{::action| translate}}</md-button>'
                + '</md-toast>',
                hideDelay: SHOW_TIMEOUT,
                position: 'bottom left',
                controller: 'pipToastController',
                locals: {
                    toast: rightToast
                }
            };

            assert(spy.calledWithMatch(object), '$mdToast.show argument should be equal to this object');
            assert.equal(spy.callCount, 1);

            done();
        });

        it('show clear toasts and hide all toasts', function (done) {

            var spyCancel = sinon.spy($mdToast, 'cancel'),
                spyShow = sinon.spy($mdToast, 'show'),
                message = 'message';

            service.showError(message);
            assert.isTrue(spyShow.called, 'should be called after show error');
            assert(spyShow.calledOnce, '$mdToast.show after show error should be called only once');

            service.clearToasts();
            assert.isTrue(spyCancel.called, 'should be called after after clearToasts without args should be called');
            assert(spyCancel.calledOnce, '$mdToast.cancel after clearToasts without args should be called only once');

            service.showError(message);

            spyCancel.reset();
            // remove error toasts, but not call $mdToast.cancel
            service.clearToasts('error');
            assert.isFalse(spyCancel.called, 'should not be called after clearToast with args');

            spyCancel.reset();
            service.hideAllToasts('error');
            assert.isTrue(spyCancel.called, 'should be called after hideAllToasts');
            assert(spyCancel.calledOnce, 'should be called only once after hideAllToasts');

            done();
        });

    });

});