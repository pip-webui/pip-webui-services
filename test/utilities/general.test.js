//
//  @file general utils module its
//  @copyright Digital Living Software Corp. 2014-2016

describe('pipUtils', function () {
    var pipUtils,
        $window,
        $state,
        stateProvider,
        $rootScope;
    
    beforeEach(module('pipUtils.General', 'pipState', function ($stateProvider) {
        stateProvider = $stateProvider;
    }));
    
    beforeEach(inject(function(_pipUtils_, _$state_, _$window_, _$rootScope_) {
        pipUtils = _pipUtils_;
        $window = _$window_;
        $state = _$state_;
        $rootScope = _$rootScope_;
    }));
    
    it('generate verification codes', inject(function (pipUtils) {
        var code = pipUtils.generateVerificationCode();

        assert.isString(code);
        assert.equal(code.length, 10);
    }));

    it('goBack', function (done) {
        var obj = { id: 'a3sffas23jkk35lbop45buor9et0hf'},
            spyState = sinon.spy($state, 'go'),
            spyWindow = sinon.spy($window.history, 'back');

        pipUtils.goBack(obj, 'obj_id', 'object');
        assert(spyWindow.called, 'when $rootScope.$prevState is null pipUtils.goBack should call $window.history.back()');
        spyWindow.reset();

        // set $rootScope.$prevState
        $rootScope.$prevState = { name: 'tool_name', params: {}};

        stateProvider.state('tool_name', { params: {  } });

        pipUtils.goBack(obj, 'obj_id', 'object');
        assert(spyState.calledWith($rootScope.$prevState.name, {obj_id: obj.id, object: obj}), 'when $rootScope.$prevState is not null pipUtils.goBack should call $state.go() ');

        done();
    });

    it('sprintf', function (done) {
        var buf = "string"
        var str = pipUtils.sprintf("here should be string: %s", buf);

        assert.equal(str, "here should be string: string");
        done();
    });
});
