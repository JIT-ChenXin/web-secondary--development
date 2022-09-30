<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%;height: 100%" :ref="id" class="anjitrading">


    <!-- -->
    <el-upload class="upload-demo" :action="`/sdata/rest/user/customize/import`" :on-change="handleChange"
      :file-list="fileList" :headers="atoken" :on-success="successFn" :on-error="errorFn">
      <el-button slot="trigger" size="small" type="primary">导入</el-button>
      <el-button size="small" type="primary" @click="exprotFn">导出</el-button>
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>

    <div class="export_anji" v-if="errorMessage.length">
      <el-table :data="errorMessage" style="width: 100%" border>
        <el-table-column prop="rowNum" label="错误行号">
        </el-table-column>
        <el-table-column prop="reason" label="报错信息">
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  Button, Upload, Table, TableColumn
} from "element-ui";
import Vue from "vue";
import utils from "@/utils";
import { queryImport, queryExport } from "./api/asset.js";

Vue.use(Button)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }

      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style")
          document.head.appendChild(this.styleEle)
          this.styleEle.innerText = style
        }
      })
      return {
        themeColor,
        textColor
      }
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      selected: "",
      buttons: [],
      atoken: { "X-XSRF-TOKEN": "03ba1ff5-9745-4a90-bdc3-d3f9baf75604" },
      defaultValue: "",
      fileList: [],
      styleEle: null, errorMessage: []
    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    this.cookieFn()

    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { buttons, id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }
    // this.$nextTick(() => {

    // })


  },
  methods: {

    cookieFn() {
      let temp = document.cookie.split(';')

      let aObj = {}
      temp.forEach((x) => {
        let obj = x.split('=')
        let key = obj[0].trim()
        aObj[key] = obj[1]
      })
      this.atoken["X-XSRF-TOKEN"] = aObj["XSRF-TOKEN"]
      console.log(aObj["XSRF-TOKEN"])
    },

    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    exprotFn() {
      queryExport().then(res => {
        var blob = res.data;
        //  FileReader主要用于将文件内容读入内存
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        // onload当读取操作成功完成时调用
        reader.onload = function (e) {
          var a = document.createElement("a");
          // 获取文件名fileName
          var fileName = res.headers["content-disposition"].split("=");
          fileName = fileName[fileName.length - 1]

          fileName = decodeURI(fileName);

          a.download = fileName;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      }).catch(err => {
        console.log(err)
      })
    },

    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    successFn(res) {
      let data = res.result
      this.errorMessage = []
      data.forEach(x => {
        x.reason || x.rowNum ? this.errorMessage.push(x) : null
      })
    },
    errorFn(res) {
      console.log(res)
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
      this.setValue(value)
    },
    setValue(value) {
      this.selected = value

    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>
<style lang="less" scoped>
.anjitrading {
  padding: 20px;

  /deep/.el-upload {
    margin-right: 20px
  }

  .export_anji {

    // background-color: rgb(242, 242, 242);
    // border: 1px solid #cecece;

    #myCanvas {
      width: 800px;
      height: 400px;

    }

    .line2 {
      float: left;
    }
  }
}
</style>
