[![Travis](https://img.shields.io/travis/gitjs/redux-form-with-ajv.svg?style=flat)](https://travis-ci.com/gitjs/redux-form-with-ajv)
[![npm](https://img.shields.io/npm/v/redux-form-with-ajv.svg?style=flat)](https://www.npmjs.com/package/redux-form-with-ajv)

# redux-form-with-ajv

This package transforms the generated [ajv](https://github.com/epoberezkin/ajv) errors to the redux-form error style, so you can use json-schema easily. It also supports custom errors messages done by the [ajv-errors](https://github.com/epoberezkin/ajv-errors) package.

## Installation
```npm install --save redux-form-with-ajv```

## Usage (For more detailed view look at examples)

```javascript
import validate from 'redux-form-with-ajv'

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema)
})(YourForm)
```

```javascript
import Ajv from 'ajv'
import validate from 'redux-form-with-ajv'

const ajv = new Ajv({ allErrors: true, verbose: true });

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { ajv })
})(YourForm)
```

## Run examples

### Simple validation with few Field(s)
```npm run examples:simple```

### Dynamic validation with FieldArrays and custom error messages
```npm run examples:fieldArrays```
