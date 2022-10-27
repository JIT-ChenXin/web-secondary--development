import React from "react";
import { Button } from "antd";

const Iframejs = (props) => {
  const addTbas = (id) => {
    console.log("iframe传递消息");
    window.parent.postMessage({ id: id }, "*");
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          addTbas("a8b59a70-aa2a-1abf-7e00-c5feab31ce8f#3");
        }}
      >
        新增二页签
      </Button>
      <Button
        type="primary"
        onClick={() => {
          addTbas("4b9b2ef8-919d-501f-35aa-77a89d90f24e#3");
        }}
      >
        新增三页签
      </Button>
      ;
    </>
  );
};

export default Iframejs;
