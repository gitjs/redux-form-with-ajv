[![Travis](https://img.shields.io/travis/gitjs/redux-form-with-ajv.svg?style=flat)](https://travis-ci.org/gitjs/redux-form-with-ajv)
[![npm](https://img.shields.io/npm/v/redux-form-with-ajv.svg?style=flat)](https://www.npmjs.com/package/redux-form-with-ajv)

# redux-form-with-ajv

This package transforms the generated [ajv](https://github.com/epoberezkin/ajv) errors to the redux-form error style, so you can use your defined json-schema easily.
It also supports custom errors messages done by the [ajv-errors](https://github.com/epoberezkin/ajv-errors).

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

## Advanced usage: `options`

### Use your custom ajv instance via `ajv` option

You can use `ajv` option when you need full control of ajv. It is only mandatory to pass three options,
`allErrors`, `verbose` and `jsonPointers`.

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

### Customize error message via `errorMessage` option

You can use `errorMessage` option to pass a function that will receive an `ajv` error object as argument and should return error message.

```javascript
import validate from 'redux-form-with-ajv'

const errorMessage = (error) => {
  if (error.keyword === 'required') {
    return 'is required'
  }

  return error.message
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
