/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";
import './index.css'
import { Table, TableColumn } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);

import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["衬衫","高跟鞋"], ["衬衫" , 3] ,["高跟鞋",10], ["衬衫" , 3] ,["高跟鞋",10], ["衬衫" , 3] ,["高跟鞋",10]]'
    );
    const options = {
      externalVariables: {
        // "图标中间文字颜色上": '',
        // "图标中间文字字号上": '',
        // "图标中间文字类型上": '',
        // "图标中间文字加粗上": '',
        // "图标中间文字颜色中": '',
        // "图标中间文字字号中": '20',
        // "图标中间文字类型中": '',
        // "图标中间文字加粗中": '',
        // "图标中间文字颜色下": '',
        // "图标中间文字字号下": '',
        // "图标中间文字类型下": "",
        // "图标中间文字加粗下": '',
        "数据标签字号": 20,
        "数据标签颜色": '',
        "数据标签字体": '',
        "数据标签加粗": 'true',
        // "环内百分比字号": 20,
        // "环内百分比颜色": '#fff',
        // "环内百分比字体": '',
        // "环间距": '20',
        "标签线第一段的长度": '200',
        "标签线第二段的长度": '180',
        // "图例大小": 20,
        // "图例字体大小": '18',
        // "图例间距": '100',
        // "标签线颜色": 'red',
        // "标签线夹角": '90',
        "饼图的半径": '90%,60%',
        "提示框图例大小": '1px',
        // 数据系列颜色: 'red,blue',
        // 精确度: '1',
        渐变色: ' [ [ "blue","#fbc2eb"], [ "red","#abc2eb"]]'
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({
      render: h => <App {...{ props }} />,
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
}
