//
//  @file string utils module its
//  @copyright Digital Living Software Corp. 2014-2016

describe('pipStrings', function() {
	var pipStrings;
	
	beforeEach(module('pipUtils.Strings'));
	
	beforeEach(inject(function($injector) {
		pipStrings = $injector.get('pipStrings');
	}));
	
	it('make string', function(done) {
		var original = '123456789';
		var result = pipStrings.sampleLine(original, 5);
		assert.equal(result, '12345');

		done();
	});
});