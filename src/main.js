import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Tooltip } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Tooltip);

// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    assetId: "54b18540-a396-41a6-9333-34ab04336df0",
    menuId: "d7c51222-fc24-42d2-b793-ec974000c87d",
    title: "应用工具",
    moreTo: "http://baidu.com",
    menuTitle: "title",
    menuDesc: "desc",
    menuTo: "http",
    menuTypeTitle: "title",
    menuType: "type",
    boxHeight: "300",
    themePic:'[{"themeId":"d8724186-78cf-4c23-abb6-e931974e2df4","image":"imgUrl"},{"themeId":"52250e971ce3482491f75a7ae01af824","image":"imgUrl"}]'
  };

  let themeInfo = {
      "theme_id": "52250e971ce3482491f75a7ae01af824",
      "theme_global_config": {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-sub-color-1": "rgba(37, 55, 97,1)",
          "--theme-public-sub-color-2": "rgba(30, 41, 64,1)",
          "--theme-public-sub-color-3": "rgba(115, 141, 192,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
          "--theme-public-text-color-2": "rgba(85, 85, 85,1)",
          "--theme-public-text-color-3": "rgba(204, 204, 204,1)",
          "--theme-public-text-color-4": "rgba(245, 245, 245,1)",
          "--theme-public-background-color-1": "rgba(245, 246, 250,1)",
          "--theme-public-background-color-2": "rgba(240, 242, 247,1)",
          "--theme-public-function-color-1": "rgba(255, 102, 102,1)",
          "--theme-public-function-color-2": "rgba(255, 148, 0,1)",
          "--theme-public-function-color-4": "rgba(61, 204, 180,1)",
          "--theme-public-function-color-5": "rgba(73, 129, 47,1)",
          "--theme-public-fontSize-1": "56px",
          "--theme-public-fontSize-2": "48px",
          "--theme-public-fontSize-3": "36px",
          "--theme-public-fontSize-4": "20px",
          "--theme-public-fontSize-5": "18px",
          "--theme-public-fontSize-6": "16px",
          "--theme-public-fontSize-7": "14px",
          "--theme-public-fontFamily-1": "Microsoft YaHei"
      }
  }

  new Vue({
    render: h => {
      return <App customConfig={customConfig} themeInfo={themeInfo}/>;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />,
      }).$mount(div);
    }
  );
}
