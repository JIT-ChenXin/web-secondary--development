import React from "react";
import App from "../src/App";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    data: '[{"assetid":"a400edb5-ddc3-46a7-b684-0b9886982376","id":"123456","assetname":"房产金额","column":"房产名称"},{"opeartion":"*"},{"assetid":"a400edb5-ddc3-46a7-b684-0b9886982376","assetname":"房产金额2","id":"123456","column":"房产名称"}]',
    // data: '',
    onChange: (values) => {
      console.log(values);
      setState(values);
    },
    formConfig: {},
    component: {},
    configuration: '{"size":"large","placeholder":"33333","allowClear":true}',
    componentCenter,
    eventCenter,
  };

  const [state, setState] = React.useState(customConfig.data);

  return (
    <div>
      <App {...customConfig} type="child" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
      <div>当前保存在后台的值: {state}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
