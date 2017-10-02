[![Travis](https://img.shields.io/travis/gitjs/redux-form-with-ajv.svg?style=flat)](https://travis-ci.com/gitjs/redux-form-with-ajv)
[![npm](https://img.shields.io/npm/v/redux-form-with-ajv.svg?style=flat)](https://www.npmjs.com/package/redux-form-with-ajv)

# redux-form-with-ajv

This package transforms the generated [ajv](https://github.com/epoberezkin/ajv) errors to the redux-form error style, so you can use json-schema easily. It also supports custom errors messages done by the [ajv-errors](https://github.com/epoberezkin/ajv-errors) package.

## Installation
```npm install --save redux-form-with-ajv```

## Basic usage

```javascript
import validate from 'redux-form-with-ajv'

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema)
})(YourForm)
```

## Advanced usage with custom ajv instance

```javascript
import Ajv from 'ajv'
import validate from 'redux-form-with-ajv'

// Be sure to set the mandatory options!  
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  jsonPointers: true  
});

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { ajv })
})(YourForm)
```

## Customize error message via `errorMessage` option

You can use `errorMessage` option to pass function that will receive `ajv` error object as argument and should return error message.

```javascript
import validate from 'redux-form-with-ajv'

const errorMessage = (_error) => {
  if (_error.keyword === 'required') {
    return 'is required'
  }

  return _error.message
}

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { errorMessage })
})(YourForm)
```

## Run examples

### Simple validation with few Field(s)
```npm run examples:simple```

### Dynamic validation with FieldArrays and custom error messages
```npm run examples:fieldArrays```
