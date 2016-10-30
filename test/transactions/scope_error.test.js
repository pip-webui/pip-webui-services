//
//  @file errors module its
//  @copyright Digital Living Software Corp. 2014-2016


describe('pipError', function() {

    describe('service block', function () {
        var $rootScope,
            scopeName = "ERROR",
            errorObj,
            service;

        beforeEach(module('pipErrors'));

        beforeEach(inject(function (pipError, _$rootScope_) {
            service = pipError;
            $rootScope = _$rootScope_;
        }));
//
        it('create error', function (done) {

            errorObj = service(scopeName);

            assert.isDefined($rootScope.errors, "$rootScope.errors should be defined");
            assert.isObject($rootScope.errors, "$rootScope.errors should be an object");
            assert.isObject(errorObj, "error should be an object");

            done();
        });

        it('set error', function (done) {
            var backendError = {
                message: 'error message',
                status: '1000'
            };

            errorObj = service(scopeName);
            errorObj.set(backendError);

            assert.isDefined($rootScope.errors[scopeName], "$rootScope.errors[scope] should be defined");
            assert.strictEqual(errorObj.message(), backendError.message, "error message should be equal to backend error message");
            assert.strictEqual(errorObj.code(), backendError.status, "error code should be equal to backend error code");
            assert.deepEqual(errorObj.details(), backendError, "error details should be equal to backend error object or data");

            done();
        });

    });

});