import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import objectPath from 'object-path';
const hashObject = require('hash-object')

const ajv = AjvErrors(new Ajv({
  allErrors: true,
  extendRefs: true,
  verbose: true,
  useDefaults: true,
  jsonPointers: true
}), {keepErrors: false});

export default (schema, values) => {

  console.log(hashObject(schema));

  let errors = {};
  console.log(0.1, schema);
  const validate = ajv.compile(schema);
  console.log(0.2);
  const valid = validate(values);
  console.log(0.3);

  console.log('ajv', validate.errors);

  if (!valid) {
    const errorMap = new Map(validate.errors.map((error) => {
      let path = error.dataPath;
      let message = error.message;

      console.log(1);
      // replace "/" with dot (.) so object-path can set path correctly
      path = path.replace(/\//g, '.').substring(1);

      if (error.params.missingProperty) {
        path += '.' + error.params.missingProperty;
      }

      console.log(2);
      if (error.parentSchema && error.parentSchema.type === 'array') {
        path += '._error';
      }

      console.log(3);
      return [ path, message ];
    }));

    const sortedErrorMap = new Map([ ...errorMap.entries() ]
      .sort((a, b) => a[0].length - b[0].length));

    sortedErrorMap.forEach((message, path) => {
      // TODO this manipulates the schema by reference but why?!?!?!?!
      // check -> inherit props or immutable 
      /*!path
        ? errors = Object.assign(errors, message)
        : objectPath.set(errors, path, message);*/

      if (path)
        objectPath.set(errors, path, message);

      console.log('add ', !path ? 'assign' : 'path');
      console.log('current errors', errors);
    });
  }
/*
  Object.assign(errors, {
    clubName: 'Required'
  });

  objectPath.set(errors, 'members.0', {
    firstName: 'first name',
    lastName: 'last name'
  });

  objectPath.set(errors, 'members.0.hobbies.0', 'test');
  objectPath.set(errors, 'members.0.hobbies.1', 'test');
  objectPath.set(errors, 'members.0.hobbies.2', 'test');
  objectPath.set(errors, 'members.0.hobbies.3', 'test');
  objectPath.set(errors, 'members.0.hobbies._error', 'test');
*/
  console.log('errors', errors);

  return {};
}
