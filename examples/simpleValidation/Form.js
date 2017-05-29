import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from 'redux-form-with-ajv'

const schema = {
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "minLength": 6
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "number",
      "minimum": 18
    }
  },
  "required": [ 'username', 'email', 'age' ]
};

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

const SyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" type="text" component={renderField} label="Username"/>
      <Field name="email" type="email" component={renderField} label="Email"/>
      <Field name="age" type="number" component={renderField} label="Age"/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'syncValidation',
  validate: (values) => validate(schema, values)
})(SyncValidationForm)
