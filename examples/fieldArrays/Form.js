import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import validate from 'redux-form-with-ajv';

const schema = {
  definitions: {
    hobby: {
      type: 'string'
    },
    member: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        hobbies: {
          type: 'array',
          default: [],
          items: {
            $ref: '#/definitions/hobby'
          },
          maxItems: 3
        }
      },
      errorMessage: {
        required: {
          firstName: 'First Name is required (custom error message)',
          lastName: 'Last Name is required (custom error message)'
        }
      },
      required: ['firstName', 'lastName']
    }
  },
  type: 'object',
  properties: {
    clubName: {
      type: 'string'
    },
    members: {
      type: 'array',
      default: [],
      items: {
        $ref: '#/definitions/member'
      },
      minItems: 1,
      errorMessage: {
        minItems: 'At least one member must be entered (custom error message)'
      }
    }
  },
  errorMessage: {
    required: {
      clubName: 'Required (custom error message)'
    }
  },
  required: ['clubName']
};

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

const renderMembers = ({ fields, meta: { touched, error, submitFailed } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>
        Add Member
      </button>
      {(touched || submitFailed) && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) => (
      <li key={index}>
        <button type="button" title="Remove Member" onClick={() => fields.remove(index)} />
        <h4>Member #{index + 1}</h4>
        <Field name={`${member}.firstName`} type="text" component={renderField} label="First Name" />
        <Field name={`${member}.lastName`} type="text" component={renderField} label="Last Name" />
        <FieldArray name={`${member}.hobbies`} component={renderHobbies} />
      </li>
    ))}
  </ul>
);

const renderHobbies = ({ fields, meta: { error } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>
        Add Hobby
      </button>
    </li>
    {fields.map((hobby, index) => (
      <li key={index}>
        <button type="button" title="Remove Hobby" onClick={() => fields.remove(index)} />
        <Field name={hobby} type="text" component={renderField} label={`Hobby #${index + 1}`} />
      </li>
    ))}
    {error && <li className="error">{error}</li>}
  </ul>
);

const FieldArraysForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="clubName" type="text" component={renderField} label="Club Name" />
      <FieldArray name="members" component={renderMembers} />
      <div>
        <button type="submit" disabled={submitting}>
          Submit
        </button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'fieldArrays',
  validate: validate(schema)
})(FieldArraysForm);
