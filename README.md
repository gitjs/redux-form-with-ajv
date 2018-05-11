[![Travis](https://img.shields.io/travis/gitjs/redux-form-with-ajv.svg?style=flat)](https://travis-ci.org/gitjs/redux-form-with-ajv)
[![npm](https://img.shields.io/npm/v/redux-form-with-ajv.svg?style=flat)](https://www.npmjs.com/package/redux-form-with-ajv)

# redux-form-with-ajv

This package combines redux-form with json-schema. It transforms the generated ajv errors to a way that redux-form can work with. As validation library it uses [ajv](https://github.com/epoberezkin/ajv).

The advanced usage give you more control about ajv itself, so you can pass your own instance of ajv maybe with plugins like `ajv-errors`, `ajv-keywords`, `ajv-i18n (must be passed by localize option)` and so on, as well you have full control about the error via a callback.

## Installation

`npm install --save redux-form-with-ajv`

## Basic usage

```javascript
import validate from 'redux-form-with-ajv';

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema)
})(YourForm);
```

## Advanced usage: `options`

### Use your custom ajv instance via `ajv` option

You can use `ajv` option when you need full control of ajv. It is only mandatory to pass two options,
`allErrors` and `verbose`.

```javascript
import Ajv from 'ajv';
import validate from 'redux-form-with-ajv';

// Be sure to set the mandatory options!
const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { ajv })
})(YourForm);
```

### Localize error message via `localize` option with ajv-i18n

You can use `localize` option to pass the translations from ajv-i18n.

```javascript
import localize from 'ajv-i18n';
import validate from 'redux-form-with-ajv';

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { localize: localize.sv })
})(YourForm);
```

### Customize error message via `errorMessage` option

You can use `errorMessage` option to pass a function that will receive an `ajv` error object as argument and should return error message.

```javascript
import validate from 'redux-form-with-ajv';

const errorMessage = error => {
  if (error.keyword === 'required') {
    return 'is required';
  }

  return error.message;
};

export default reduxForm({
  form: 'yourForm',
  validate: validate(yourJsonSchema, { errorMessage })
})(YourForm);
```

## Run examples

### Simple validation with few Field(s)

`npm run examples:simple`

### Dynamic validation with FieldArrays and custom error messages

`npm run examples:fieldArrays`
