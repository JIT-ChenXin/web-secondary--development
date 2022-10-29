/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  // 添加 customConfig 进行测试
  window.currentUser = {
    account_code: '1234567890', id: '1234567890id', loginName: "admin"
  }
  let customConfig = {
    title: "数据构建",
    logoUrl: null,
    msgLink: "https://www.baidu.com",
    mainHeight: null, buttons: [{ name: 'ddd', url: '455454545', }]
  };
  let isConfig = 'dd';
  ReactDOM.render(<App customConfig={customConfig} isConfig={isConfig} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props, '====8080');
    ReactDOM.render(<App {...props} />, dom);
  });
}
