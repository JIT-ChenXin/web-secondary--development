import Vue from "vue";
import App from "./App.vue";
import "./styles/index.css"; // global css
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Table, TableColumn, Checkbox, Pagination, Form, Cascader, FormItem, DatePicker } from "element-ui";
import { Message } from "element-ui";

Vue.component(Message);
//挂载到Vue全局对象上
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Cascader);
Vue.use(DatePicker);

// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "http://baidu.com",
    imgUrl: "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
  };

  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(div);
  });
}
