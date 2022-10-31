<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%;height: 100%" :ref="id" class="enclosure_two">
    <!-- -->
    <div class="tree_enclosure">
      <div class="tree_news" :style="{ height: '400px', backgroundColor: 'white' }">
        <el-tree :data="dataTree" node-key="CODE" :indent="6" :props="defaultProps" @node-click="handleNodeClick"
          :expand-on-click-node="false">
          <!-- <template class="custom-tree-node" slot-scope=" { node, data }">
            <div class="tree"> {{ node.label }}</div>
            <span>{{ node.id }}</span>
          </template> -->
          <div class="custom-tree-node" slot-scope=" { node, data }">
            <span>{{ data[directoryLable] }}</span>
            <span :style="{ color: 'red' }">({{ data.AccessoryNum ? data.AccessoryNum : 0 }})</span>

          </div>
        </el-tree>
      </div>

      <div class="table_enclosure">
        <el-table :data="dataTable" header-row-class-name="tbale_header_two">
          <el-table-column label="序号" type=index align="center"></el-table-column>
          <el-table-column label="文件名称" :prop="enclosureName" align="center" min-width="200px"></el-table-column>
          <el-table-column label="时间" :prop="enclosureDate" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="onLinePreview(scope.row, dataTable)" type="text" size="small">
                在线预览
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage4" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
        </el-pagination>
      </div>
    </div>

    <!-- <button @click="changeFn">时间</button>
    <img :src="imgSrc" alt="">
    <iframe :src="imgSrc" alt=""> </iframe> -->

    <el-dialog title="预览" :visible.sync="dialogVisible" width="50%">

      <iframe v-if="urlState" :src="imgSrc" width="100%" height="100%"></iframe>
      <div class="err_Url" width="100%" height="100%" v-else>加载失败</div>
    </el-dialog>

  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup,
  Tree, Table, TableColumn, Pagination, Button, Dialog, Upload
} from "element-ui";
import Vue from "vue"
import utils from "@/utils";
import tempData from "./utils/tree.js";
// import axios1 from "axios";
import { queryAssetById, queryMenuTree, queryAccessoryData, getFileStream } from './api/asset'
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tree)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Upload)

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

      defaultValue: "",
      styleEle: null, currentPage4: 1,
      dialogVisible: false,
      dataTree: [],
      dataTable: [],
      defaultProps: {
        label: 'FOLDER_NAME',
        children: 'childList'
      },
      pageSize: 5,
      dataAll: [],
      pageTotal: 0,
      dialogValue: null,
      imgSrc: '',
      dirAssetId: this.customConfig?.dirAssetId || '7a1ee5ed-a4de-5330-ac82-8af1ab2a02fa',
      directoryLable: this.customConfig?.directoryLable || 'FOLDER_NAME',
      enclosureAssetId: this.customConfig?.enclosureAssetId || '5a6c9715-0f0f-1559-6d94-eb82e88aff94',
      enclosureName: this.customConfig?.enclosureName || 'NAME',
      enclosureDate: this.customConfig?.enclosureDate || 'UPLOAD_DATE',
      enclosureId: this.customConfig?.enclosureId || 'ID',
      voucherId: '',
      urlState: true,
    }
  },
  mounted() {
    //用于注册事件定义，不可删除

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
    this.defaultProps.label = this.directoryLable
    this.voucherId = 242
    this.queyTree()

    // this.dataTree = tempData.tree
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }
  },
  methods: {
    queyTree() {

      queryMenuTree(this.dirAssetId, this.voucherId).then(res => {
        this.dataTree = res.data
        // let arr = temp.map((x, i) => {
        //   let strL = x.CODE.length
        //   x.parentId = x.CODE.substr(0, strL - 3)

        //   return {
        //     label: x.FOLDER_NAME,
        //     id: x.CODE,
        //     parentId: x.parentId
        //   }
        // })
        // this.dataTree = this.formatTree(arr)

      }).catch(err => {
        console.log(err);
      })
    },
    formatTree(obj) {
      let copyedObj = JSON.parse(JSON.stringify(obj))  //深拷贝源数据
      return copyedObj.filter(parent => {

        let findChildren = copyedObj.filter(child => {

          return parent.id === child.parentId
        })
        findChildren.length > 0 ? parent.children = findChildren : parent.children = []
        return parent.parentId == 0   //返回顶层，依据实'际情况判断这里的返回值
      })
    },
    handleNodeClick(data) {
      // this.dataTable = tempData.table.slice(0, this.currentPage4 * this.pageSize)
      // this.pageTotal = tempData.table.length
      queryAccessoryData(this.enclosureAssetId, this.voucherId, data.CODE).then(res => {
        this.dataAll = res.data
        this.dataTable = this.dataAll.slice(0, this.currentPage4 * this.pageSize)
        this.pageTotal = this.dataAll.length
      }).catch(err => {

      })
    },
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    handleSizeChange(val) {
      this.dataTable = this.dataAll.slice((this.currentPage4 - 1) * val, (this.currentPage4 - 1) * val + val)
      this.pageSize = val
    },
    handleCurrentChange(val) {

      this.dataTable = this.dataAll.slice((val - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize)

      this.currentPage4 = val
    },
    onLinePreview(i, data) {
      this.dialogVisible = true

      getFileStream(i[this.enclosureId]).then(res => {
        let data = res.data
        let blob = new Blob([data]);   // 返回的文件流数据
        let url = window.URL.createObjectURL(blob);  // 将他转化为路径
        this.imgSrc = url
        this.urlState = true
        // this.imgSrc = 'https://cdn.colorhub.me/ubU3Lj_0Khg/rs:auto:0:500:0/g:ce/fn:colorhub/bG9jYWw6Ly8vZmMvY2EvNjEwMGJhM2UwNzk5ZTAzODIxZDlkYTA4MDk1MjU2Yjg2OTY5ZmNjYS5qcGVn.webp'
        // 
      }).catch(err => {
        this.urlState = false
      })
    },
    // changeFn(e) {
    //   // storage_area/form/1234567890/ca1422ee93d14faf8447979077481ac1.pdf
    //   // http://10.15.110.11:12245/storage_area/form/1234567890/749e9b4e04414d1291bd9317055dd836.jpg
    //   axios1.get('api/storage_area/form/1234567890/749e9b4e04414d1291bd9317055dd836.jpg', { responseType: "blob" }).then(res => {
    //     let url = window.URL.createObjectURL(res.data);  // 将他转化为路径
    //     console.log(res, '===');
    //     console.log(url);
    //     this.imgSrc = url
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // let file = e.target.files
    // let url = window.URL.createObjectURL(file[0]);  // 将他转化为路径
    // this.imgSrc = url
    // window.testfile = file[0]
    // console.log(this.imgSrc, file[0], '======');
    // },
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
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue({ value }) {
      this.voucherId = value
      this.queyTree()
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
.enclosure_two {
  .tree_enclosure {
    display: flex;
    justify-content: space-between;

    .tree_news {
      width: 20%;
      border: 1px solid #cecfce;

      overflow-y: auto
    }

    .table_enclosure {
      width: 78%;

      /deep/.el-table th.el-table__cell {
        background-color: transparent
      }

      /deep/.tbale_header_two {
        background-color: #3196f7;
        color: white
      }

      /deep/.el-button--text {
        color: #1b8b17
      }
    }
  }

  /deep/.el-dialog__body {
    height: 620px;
    padding: 10px;
  }

  .err_Url {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }
}
</style>
