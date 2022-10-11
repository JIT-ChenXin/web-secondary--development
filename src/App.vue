<template>
  <div class="custom-node">
    <div class="modleTop">
      <div
        class="NodeIcon"
        :style="{
          marginTop: '6px',
          display: icon.html ? 'inline-block' : 'none',
        }"
        v-html="icon.html"
      />
      <img
        class="NodeIcon"
        :src="getIconUrl"
        alt=""
        :style="{
          display: !icon.html ? 'inline-block' : 'none',
        }"
      />
      <el-input placeholder="动态输入" v-model="nodeName" @input="inputChangeVal" :style="{ marginTop: '15px', width: '200px' }" />
    </div>
    <div class="custom-node-content">
      <div class="content-row">
        <div class="row-left">选择字段：</div>
        <div class="row-right">
          <el-select :value="selectCols" @change="changeField" placeholder="请选择" class="textClass" multiple collapse-tags :style="{ width: '200px', marginLeft: '10px' }">
            <el-option :key="t.col_index" :label="t.col_name" :value="t.col_name" v-for="t in tests" />
          </el-select>
        </div>
      </div>
      <div class="content-row" style="margin-left: 60px">
        <div class="row-left">接口地址：</div>
        <div class="row-right">
          <el-input v-model="apiSrcInput" placeholder="请输入地址" @change="srcChange"></el-input>
        </div>
      </div>
    </div>
    <div class="custom-node-content">
      <div class="content-row" style="margin-left: 60px">
        <div class="row-left">请求类型：</div>
        <div class="row-right"> 
          <el-radio-group v-model="methodStr" @change="srcChange">
            <el-radio label="get">GET</el-radio>
            <el-radio label="post">POST</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="content-row-add" style="margin-left: 60px">
        <div class="row-left">输出参数：</div>
        <div class="row-right-add">
          <div class="addInput" v-for="item,index in outFields" :key="index" >
            <el-input v-model="item.col_name" @change="srcChange"></el-input>
            <i class="el-icon-delete" style="margin-left: 10px" @click="delInput(index)"></i>
          </div>
        </div>
        <el-button class="addBtn" type="primary" icon="el-icon-plus" size="mini" circle @click="addInput"></el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    currentNode: String,
    nodeCode: String,
    nodeFieldList: Object,
    nodeInfoList: Object,
    obj_id: String,
    updateNode: Function,
    customIcon: Object,
    img: String,
  },
  data() {
    let currentNodes = this.currentNode
    let detail = this.nodeInfoList[currentNodes] || {}
    let currentfieldList = this.nodeFieldList[currentNodes] || {}
    let label = detail.label?.split(':')[1]
    let field = detail.data?.detail?.inColumns || []
    let getApiSrc = detail.data?.detail?.apiSrc || ''
    let methodStr = detail.data?.detail?.method || ''
    let outField = detail.data?.detail?.selectedColumns || []
    let outputs = detail.data?.detail?.outputs || []
    const tests = currentfieldList[currentNodes] || []
    const newIcon = this.customIcon || {}
    return {
      nodeName: label,
      fields: field,
      outFields: outField,
      detail,
      currentNodes,
      currentfieldList,
      tests,
      outputs,
      selectCols: field.map((_) => _.col_name),
      icon: newIcon,
      apiSrcInput: getApiSrc,
      methodStr: methodStr,
      textareaShow: false,
    }
  },
  mounted() {},
  methods: {
    updateNode1(newName, newFields) {
      let detail = this.detail
      detail.data = detail.data || {}
      detail.data.detail = detail.data.detail || {}
      detail.data.text = {
        internalName: newName,
        code: this.currentNodes,
      }
      detail.data.detail.inColumns = newFields
      detail.data.detail.selectedColumns = this.outFields
      detail.data.detail.outputs = this.outFields.map(x=>{
        return {
          index: x.col_index,
          name: x.col_name,
          datatype: "0",
          col_index: x.col_index,
          col_name: x.col_name,
          col_datatype: "0",
        }
      })
      detail.data.detail.apiSrc = this.apiSrcInput
      detail.data.detail.method = this.methodStr
      detail.label = this.currentNodes + ':' + newName

      this.updateNode(detail)
    },
    inputChangeVal(value) {
      this.nodeName = value
      this.updateNode1(value, this.fields)
    },
    changeField(fieldOpt) {
      let ele = this.tests.filter((test) => fieldOpt.includes(test.col_name))
      this.selectCols = fieldOpt
      this.fields = ele
      this.updateNode1(this.nodeName, ele)
    },
    srcChange(val) {
      this.updateNode1(this.nodeName, this.fields)
    },
    delInput(index) {
      this.outFields.splice(index, 1)
      this.updateNode1(this.nodeName, this.fields)
    },
    addInput() {
      let obj = {
        col_index: this.outFields.length,
        col_name: "",
        col_datatype: "0",
      }
      this.outFields.push(obj)
    }
  },
  computed: {
    getIconUrl() {
      return `${window.location.origin}/storage_area/ext_plugins/web/${this.obj_id}/images/${this.img}`
    },
  },
}
</script>
<style lang="less" scoped>
.custom-node {
  height: 100%;
  width: 100%;
  background-color: white;
  overflow-y: auto;
  .modleTop {
    display: flex;
    .NodeIcon {
      color: #9e9e9e;
      margin-left: 18px;
      margin-top: 15px;
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
  }

  .custom-node-content {
    display: flex;
    justify-content: space-around;
    height: 140px;
    padding: 20px 40px;

    .content-row {
      height: 48px;
      display: flex;
      align-items: center;

      .row-left {
        width: 130px;
        text-align: left;
      }

      .row-right {
        display: flex;
        align-items: center;
      }
    }
    .content-row-add {
      height: 48px;
      display: flex;
      align-items: flex-start;

      .row-left {
        margin-top: 8px;
        width: 130px;
        text-align: left;
      }

      .addBtn {
        margin: 6px 0 0 20px;
      }
      .row-right-add {
        display: flex;
        flex-direction: column;
        align-items: center;

        .addInput {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>