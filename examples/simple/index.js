import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import { Code, Markdown, Values } from "redux-form-website-template";

const content = document.createElement("div");
content.setAttribute("id", "content");
const dest = document.body.appendChild(content);
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
});
const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer);

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {
      // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
      resolve();
    }, 500);
  });

let render = () => {
  const Form = require("./Form").default;
  const raw = require("!!raw-loader!./Form");
  ReactDOM.render(
    <Provider store={store}>
      <div style={{ margin: "0 200px" }}>
        <h2>Form</h2>
        <Form onSubmit={showResults} />
        <Values form="syncValidation" />
        <h2>Code</h2>
        <h3>Form.js</h3>
        <Code source={raw} />
      </div>
    </Provider>,
    dest
  );
};

render();
