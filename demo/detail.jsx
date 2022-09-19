import React from "react";
import App from "../src/App";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    data: "111",
    formConfig: {},
    component: {},
    configuration: '{"size":"large","placeholder":"请输入内容","allowClear":true}',
  };
  return (
    <div>
      <App {...customConfig} type="preview" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
