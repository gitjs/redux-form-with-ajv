import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { Code, Markdown, Values } from 'redux-form-website-template';

const content = document.createElement('div');
content.setAttribute('id', 'content');
const dest = document.body.appendChild(content);
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
});
const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer);

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {  // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      resolve()
    }, 500)
  });

let render = () => {
  const Form = require('./Form').default;
  const raw = require('!!raw!./Form');
  ReactDOM.render(
    <Provider store={store}>
      <div style={{ margin: '0 200px' }}>
        <h2>Form</h2>
        <Form onSubmit={showResults}/>
        <Values form="fieldArrays"/>
        <h2>Code</h2>
        <h3>Form.js</h3>
        <Code source={raw}/>
        <h3>validate.js</h3>
      </div>
    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render;
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error} className="redbox"/>,
      dest
    )
  };
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  };
  const rerender = () => {
    setTimeout(render)
  };
  module.hot.accept('./Form', rerender);
  module.hot.accept('!!raw!./Form', rerender);
}

render();
