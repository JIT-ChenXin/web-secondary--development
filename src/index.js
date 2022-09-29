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
  let customConfig = {
    JSON脚本: {
      mainAssetId: "32a46043-f46a-fbfb-a3cf-c5529ee0399f",
      detailAssetId: ["c059eb94-f5d3-1065-139e-4dc5202bcb4d", "24d2b6e7-21f0-7574-1112-338ace8e1c7c"],
      mainColumnList: ["name", "id_card"],
      detailColumnList: ["address,story_height", "family,birthday"],
      dict: [{ 2: "二层", 1: "一层", column: "story_height" }],
      regular: [
        { column: "b", regStr: "^[\\u4e00-\\u9fa5]+$" },
        { column: "c", regStr: "[\\u4e00-\\u9fa5]" },
      ],
      cruxKey: "idcard",
      relationFields: [
        { mainRelationField: "id", subRelationField: "parent_id" },
        { mainRelationField: "id", subRelationField: "parent_id" },
      ],
    },
  };
  ReactDOM.render(<App customConfig={customConfig} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
