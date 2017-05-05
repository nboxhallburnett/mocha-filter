# Mocha Filter

This package allows you to add custom filters to the various test stages in the [Mocha](https://www.npmjs.com/package/mocha) test framework.

By default (when you ```require('mocha-filter')```) an ```ignore``` filter is added, which will completely remove a test (or set of tests) from the test run without leaving a trace in the test output.

## Examples
The filters can be used to restrict test runs to only be used when in specific environments:

```javascript
var filter = require('mocha-filter');

filter.addFilter('preprod', () => {
	return _config.test_env === 'pre-production';
});

describe.preprod('A test set which should only run in pre-production', () => {
	//...
});

```

So long as the supplied function for the filter returns `true`, `false`, or `'skip'`, you can make it execute whatever you would like, without having to wrap tests in conditionals

```javascript
filter.addFilter('dataSupplied', () => {
	if (!_config.sample_data) {
		console.error('Error: data not supplied. Skipping test.');
		return false;
	}
	return true;
});

describe('Example tests', () => {
	it.dataSupplied('Test to only run when sample data is supplied', done => {
		//...
		done();
	});
})
```

You can also add multiple filters at once by passing an object containing all the required funtions, with the key being the name of the filter:
```javascript
var filter = require('mocha-filter');

var filters = {
	example: () => {
		return true;
	},
	otherExample: () => {
		return false;
	}
}

filter.addFilters(filters);

describe('Using multiple filters', () => {
	it.example('Example test', done => {
		//...
		done();
	})

	it.otherExample('Other Example test', done => {
		//...
		done();
	});
})
```

Alternatively, you can pass in a default set of filters when requiring the package:
```javascript
var filters = {
	example: () => {
		return true;
	},
	otherExample: () => {
		return false;
	}
}

var filter = require('mocha-filter')(filters);

describe('Using multiple filters', () => {
	it.example('Example test', done => {
		//...
		done();
	})

	it.otherExample('Other Example test', done => {
		//...
		done();
	});
})
```
