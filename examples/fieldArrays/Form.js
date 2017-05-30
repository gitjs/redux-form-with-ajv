import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import validate from 'redux-form-with-ajv';

const schema = {
  "definitions": {
    "hobby": {
      "type": "string"
    },
    "member": {
      "type": "object",
      "properties": {
        "firstName": {"type": "string"},
        "lastName": {"type": "string"},
        "hobbies": {
          "type": "array",
          "default": [],  
          "items": {
            "$ref": "#/definitions/hobby"
          },
          "maxItems": 3
        }
      },
      "errorMessage": {
        "required": {
          "firstName": "First Name is required (custom error message)",
          "lastName": "Last Name is required (custom error message)"
        }
      },
      "required": [ "firstName", "lastName" ]
    }
  },
  "type": "object",
  "properties": {
    "clubName": {
      "type": "string"
    },
    "members": {
      "type": "array",
      "default": [],
      "items": {
        "$ref": "#/definitions/member"
      },
      "minItems": 1,
      "errorMessage": {
        "minItems": "At least one member must be entered"
      }
    }
  },
  "errorMessage": {
    "required": {
      "clubName": "Required"
    }
  },
  "required": [ "clubName" ]
};

const renderField = ({input, label, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

const renderMembers = ({fields, meta: {touched, error, submitFailed}}) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Member</button>
      {(touched || submitFailed) && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Member"
          onClick={() => fields.remove(index)}/>
        <h4>Member #{index + 1}</h4>
        <Field
          name={`${member}.firstName`}
          type="text"
          component={renderField}
          label="First Name"/>
        <Field
          name={`${member}.lastName`}
          type="text"
          component={renderField}
          label="Last Name"/>
        <FieldArray name={`${member}.hobbies`} component={renderHobbies}/>
      </li>
    )}
  </ul>
);

const renderHobbies = ({fields, meta: {error}}) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>Add Hobby</button>
    </li>
    {fields.map((hobby, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Hobby"
          onClick={() => fields.remove(index)}/>
        <Field
          name={hobby}
          type="text"
          component={renderField}
          label={`Hobby #${index + 1}`}/>
      </li>
    )}
    {error && <li className="error">{error}</li>}
  </ul>
);

const FieldArraysForm = (props) => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="clubName" type="text" component={renderField} label="Club Name"/>
      <FieldArray name="members" component={renderMembers}/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
};

const validate2 = values => {


  const errors = {}
  if (!values.clubName) {
    errors.clubName = 'Required'
  }
  if (!values.members || !values.members.length) {
    errors.members = {_error: 'At least one member must be entered'}
  } else {
    const membersArrayErrors = []
    values.members.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.firstName) {
        memberErrors.firstName = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.lastName) {
        memberErrors.lastName = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member && member.hobbies && member.hobbies.length) {
        const hobbyArrayErrors = []
        member.hobbies.forEach((hobby, hobbyIndex) => {
          if (!hobby || !hobby.length) {
            hobbyArrayErrors[hobbyIndex] = 'Required'
          }
        })
        if (hobbyArrayErrors.length) {
          memberErrors.hobbies = hobbyArrayErrors
          membersArrayErrors[memberIndex] = memberErrors
        }
        if (member.hobbies.length > 5) {
          if (!memberErrors.hobbies) {
            memberErrors.hobbies = []
          }
          memberErrors.hobbies._error = 'No more than five hobbies allowed'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
    })
    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors
    }
  }

  console.log('validate 2', errors);
  return errors
}

export default reduxForm({
  form: 'fieldArrays',
  validate: values => validate(schema, values)
  //validate: validate2
})(FieldArraysForm)
