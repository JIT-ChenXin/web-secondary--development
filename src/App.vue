<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%;height: 100%" class="panservice" :ref="identification">
    <!-- -->
    <button :class="{p_Report:true,active:stateR=='month'}" @click="reportClick('month')">月报</button>
    <button :class="{p_Report:true,active:stateR=='year'}" @click="reportClick('year')">年报</button>

    <div class="peizhi">
      <div class="p_left">
        <div class="p_l_M" v-if="stateM">
          <span class="pz_span">选择月份:</span>
          <el-date-picker prefix-icon="1" v-model="timeStart" @change="timeStartFn" type="month"
            :picker-options="pickerOptionsMonth1" placeholder="选择日期">
          </el-date-picker>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
            <path
              d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
              fill="white" />
            <path
              d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
              fill="white" />
          </svg>
          <<<<<<< HEAD <span>&nbsp; — &nbsp; </span>
            =======
            <span>&nbsp; —— &nbsp; </span>
            >>>>>>> 38bac2f5bcf65ac0479d9135550cd3fc46376ccf

            <el-date-picker prefix-icon="1" v-model="timeEnd" @change="timeEndFn" type="month"
              :picker-options="pickerOptionsMonth2" placeholder="选择日期">
            </el-date-picker>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
              <path
                d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
                fill="white" />
              <path
                d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
                fill="white" />
            </svg>
        </div>
      </div>
      <div class="r_left">
        <button class="p_export" @click="exportFn()"> <svg xmlns="http://www.w3.org/2000/svg" width="85" height="32"
            viewBox="0 0 85 32" fill="none">
            <path
              d="M0 2C0 0.895431 0.895431 0 2 0H83C84.1046 0 85 0.895431 85 2V30C85 31.1046 84.1046 32 83 32H2C0.89543 32 0 31.1046 0 30V2Z"
              fill="#0084FF" />
            <path
              d="M46.384 16.992C45.968 16.9813 45.6213 16.944 45.344 16.88C45.0667 16.816 44.8427 16.7093 44.672 16.56C44.5013 16.4107 44.3787 16.208 44.304 15.952C44.2293 15.6853 44.192 15.3493 44.192 14.944V9.728H54.96V14.048H45.776V14.608C45.776 14.8213 45.7867 14.992 45.808 15.12C45.8293 15.248 45.8773 15.3493 45.952 15.424C46.0267 15.488 46.1333 15.536 46.272 15.568C46.4107 15.6 46.6027 15.6213 46.848 15.632C47.936 15.6853 49.008 15.712 50.064 15.712C51.1307 15.7013 52.208 15.6747 53.296 15.632C53.5733 15.6213 53.792 15.6053 53.952 15.584C54.112 15.552 54.2347 15.5093 54.32 15.456C54.416 15.4027 54.48 15.3333 54.512 15.248C54.5547 15.152 54.5867 15.04 54.608 14.912C54.64 14.7413 54.6613 14.592 54.672 14.464C54.6933 14.3253 54.7093 14.2133 54.72 14.128L56.384 14.688C56.3627 14.8693 56.336 15.0507 56.304 15.232C56.2827 15.4027 56.2453 15.6 56.192 15.824C56.1387 16.0267 56.0693 16.1973 55.984 16.336C55.9093 16.4747 55.7867 16.592 55.616 16.688C55.456 16.7733 55.2427 16.8427 54.976 16.896C54.72 16.9493 54.384 16.9813 53.968 16.992C51.4507 17.088 48.9227 17.088 46.384 16.992ZM45.776 11.2V12.64H53.312V11.2H45.776ZM56.832 19.808H54.128V21.44C54.128 21.8453 54.0907 22.1653 54.016 22.4C53.952 22.6453 53.84 22.8373 53.68 22.976C53.52 23.1253 53.3013 23.232 53.024 23.296C52.7573 23.36 52.4213 23.408 52.016 23.44L50.832 23.536L50.4 22.08L51.52 22C51.7333 21.9893 51.904 21.968 52.032 21.936C52.1707 21.904 52.2773 21.8507 52.352 21.776C52.4267 21.7013 52.4747 21.6053 52.496 21.488C52.528 21.3707 52.544 21.216 52.544 21.024V19.808H46.72C47.1147 20.0533 47.52 20.3253 47.936 20.624C48.3627 20.9227 48.7253 21.1947 49.024 21.44L48.224 22.704C48.0213 22.544 47.7867 22.3627 47.52 22.16C47.264 21.9573 46.9973 21.76 46.72 21.568C46.4533 21.3653 46.1867 21.1733 45.92 20.992C45.664 20.8107 45.4347 20.656 45.232 20.528L45.76 19.808H42.816V18.352H52.544V17.28L54.128 17.344V18.352H56.832V19.808ZM71.734 17.28V23.536H70.102V23.008H59.558V17.248L61.19 17.312V21.504H64.854V16.144H60.022V10.496L61.638 10.56V14.576H64.854V9.056L66.438 9.12V14.576H69.654V10.496L71.254 10.56V16.144H66.438V21.504H70.102V17.216L71.734 17.28Z"
              fill="white" />
            <path
              d="M18.1396 7.18283H20.2902V19.0108C20.2902 19.3334 20.0751 19.5484 19.7526 19.5484H18.6773C18.3547 19.5484 18.1396 19.3334 18.1396 19.0108V7.18283Z"
              fill="white" />
            <path
              d="M14.269 12.9892L13.5163 12.2366C13.3012 12.0215 13.3012 11.6989 13.5163 11.4839L18.8389 6.16129C19.0539 5.94624 19.3765 5.94624 19.5915 6.16129L20.7206 7.29032L15.0216 12.9892C14.8066 13.2043 14.484 13.2043 14.269 12.9892Z"
              fill="white" />
            <path
              d="M17.7097 7.29032L18.8387 6.16129C19.0538 5.94624 19.3763 5.94624 19.5914 6.16129L24.914 11.4839C25.129 11.6989 25.129 12.0215 24.914 12.2366L24.1613 12.9892C23.9462 13.2043 23.6237 13.2043 23.4086 12.9892L17.7097 7.29032ZM28.8925 15.7849H27.8172C27.4946 15.7849 27.2796 16 27.2796 16.3226V23.3118C27.2796 23.6344 27.0645 23.8495 26.7419 23.8495H11.6882C11.3656 23.8495 11.1505 23.6344 11.1505 23.3118V16.3226C11.1505 16 10.9355 15.7849 10.6129 15.7849H9.53763C9.21505 15.7849 9 16 9 16.3226V25.4624C9 25.7849 9.21505 26 9.53763 26H28.8925C29.2151 26 29.4301 25.7849 29.4301 25.4624V16.3226C29.4301 16 29.2151 15.7849 28.8925 15.7849Z"
              fill="white" />
            <path
              d="M13.301 17.9354H10.0752V15.7849H13.301C13.6236 15.7849 13.8386 16 13.8386 16.3225V17.3978C13.8386 17.6666 13.6236 17.9354 13.301 17.9354ZM28.3548 17.9354H25.129C24.8064 17.9354 24.5913 17.7204 24.5913 17.3978V16.3225C24.5913 16 24.8064 15.7849 25.129 15.7849H28.3548V17.9354Z"
              fill="white" />
          </svg></button>
      </div>
    </div>

    <div class="tableBody">
      <div class="tableTitle">
        <div class="P_Company" :style="{width:'254px'}">用电单位</div>
        <div class="P_CompanyName">{{ricityUser}}</div>

      </div>
      <div class="tableTitle" style="borderTop:none;borderBottom:none;backgroundColor: #F8FCFF;">
        <div class="P_Company" :style="{width:'254px'}">电站名称</div>
        <div class="P_CompanyName">{{stationName}}</div>

      </div>
      <el-table :data="tableData" stripe style="width: 100%" show-summary border :row-style="{ height: '40px' }"
        :header-cell-style="{padding:0+'px'}" :cell-style="{padding:0+'px', color: '#000000'}"
        :header-row-style="{height: '50px'}">
        <el-table-column prop="date" :label="stateR=='month'?'月份':'年份'" width="254" align='center'
          :render-header="renderheader">
        </el-table-column>
        <el-table-column prop="feesSelfuse" :label="stateR=='month'?'发电量|(kWh)':'发电量|(万kWh)'" sortable align='center'
          :render-header="renderheader">
        </el-table-column>
        <el-table-column prop="powerOngrid" :label=" stateR=='month'?'上网电量|(kWh)':'上网电量|(万kWh)' " sortable
          align='center' :render-header="renderheader">
        </el-table-column>
        <el-table-column prop="powerOutput" :label="stateR=='month'?'自发自用电量|(kWh)':'自发自用电量|(万kWh)' " sortable
          align='center' :render-header="renderheader">
        </el-table-column>
        <el-table-column prop="powerSelfuse" :label="stateR=='month'?' 自发自用电费|(元)':' 自发自用电费|(万元)'" sortable
          align='center' :render-header="renderheader">
        </el-table-column>
      </el-table>

    </div>

  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup, Table,
  TableColumn, DatePicker
} from "element-ui";
import { electricityUser, queryExport } from './api/asset.js'
import Vue from "vue"
import axios1 from './api/request.js'
import utils from "@/utils";
import $ from "jquery"

Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)

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
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.identification]) {
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
      identification: "",
      stationId: '',
      //业务代码
      selected: "",
      ricityUser: null, stationName: null,
      buttons: [],
      timeDate: [],
      stateR: 'month',
      stateM: true,
      timeStart: new Date(new Date().getFullYear(), 0),
      timeEnd: new Date(new Date().getFullYear(), 11),
      tableData: [],
      pickerOptionsMonth1: {
        disabledDate: (time) => {
          return this.timeEnd ? time.getTime() > this.timeEnd.getTime() : false;
        },
      },
      pickerOptionsMonth2: {
        disabledDate: (time) => {
          return this.timeStart ? time.getTime() < this.timeStart.getTime() : false;
        },
      },
      renderheader(h, { column, $index }) {
        return h("span", {}, [h("span", {}, column.label.split("|")[0]), h("br"), h("span", {}, column.label.split("|")[1])]);
      },
      defaultValue: "",
      styleEle: null

    }
  },
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => {

          let temp = document.querySelectorAll('.el-table .el-table__body-wrapper .el-table__row')
          if (temp.length > 0) {

            if (temp[temp.length - 1].className.indexOf('el-table__row--striped') == -1) {
              console.log(11);
              let a = document.querySelectorAll('.el-table__footer-wrapper tbody td.el-table__cell')
              for (let i = 0; i < a.length; i++) {
                a[i].style.backgroundColor = '#F8FCFF'

              }
            }
          }


        })

      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    let date1 = this.timeStart.getFullYear() + '-' + (this.timeStart.getMonth() + 1)
    let date2 = this.timeEnd.getFullYear() + '-' + (this.timeEnd.getMonth() + 1)
    this.timeDate = [date1, date2]
    // this.stationId = '3'
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
    this.identification = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    //用于定义接收用户输入
    this.buttons = JSON.parse(buttons).data;
    this.defaultValue = JSON.parse(buttons).defaultValue;
    this.$nextTick(() => {
      let a = document.querySelectorAll('.el-table th.el-table__cell>.cell')
      a.forEach((x, i) => {
        if (i == 0) return
        x.firstChild.style.paddingLeft = '24px'
      });
    })
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }

    this.queryP()
  },
  methods: {
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    timeStartFn() {
      let a = this.timeStart.getFullYear()
      let b = this.timeStart.getMonth() + 1
      this.timeDate[0] = a + '-' + b
      if (this.timeDate.length == 2) {
        this.queryP()
      }
    },
    timeEndFn() {
      let a = this.timeEnd.getFullYear()
      let b = this.timeEnd.getMonth() + 1
      this.timeDate[1] = a + '-' + b
      if (this.timeDate.length == 2) {
        this.queryP()
      }
    },
    queryP() {
      let type = this.stateR
      let date = this.timeDate
      let stationId = this.stationId
      electricityUser({ type, date, stationId }).then(res => {
        let data = res.data.propertyList
        this.tableData = data
        this.ricityUser = res.data.electricityUser
        this.stationName = res.data.stationName
      })
    },
    exportFn() {
      let type = this.stateR
      let date = this.timeDate
      let stationId = this.stationId
      queryExport({ type, date, stationId }).then(res => {
        var blob = res.data
        //  FileReader主要用于将文件内容读入内存
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        // onload当读取操作成功完成时调用
        reader.onload = function (e) {
          var a = document.createElement('a')
          // 获取文件名fileName
          var fileName = res.headers['content-disposition'].split('=')
          fileName = fileName[fileName.length - 1]
          fileName = decodeURI(fileName)
          a.download = fileName
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })


    },
    reportClick(value) {
      this.stateR = value
      if (value == 'month') {
        this.stateM = true
        let date1 = this.timeStart.getFullYear() + '-' + (this.timeStart.getMonth() + 1)
        let date2 = this.timeEnd.getFullYear() + '-' + (this.timeEnd.getMonth() + 1)
        this.timeDate = [date1, date2]
      } else {
        this.stateM = false
        this.timeDate = []
      }
      this.queryP()
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
    //必需，不可删除
    Event_Center_getName() {
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
      this.setValue(value)
    },
    setValue(value) {
      this.stationId = value.value
      this.queryP()
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
.panservice {



  .p_Report {
    width: 125.52px;
    height: 32px;
    border-radius: 2px;
    opacity: 1;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    font-family: "Alibaba PuHuiTi";
    border: 1px solid rgba(222, 222, 222, 1);
    background: rgba(255, 255, 255, 1);
    cursor: pointer;
  }

  .active {
    font-weight: 700;
    border-color: rgba(27, 133, 255, 1);
    color: #1B85FF
  }

  .tableTitle {
    display: flex;
    border: 1px solid #D8DFE7;
    // border-bottom: none;
    font-size: 14px;
    line-height: 40px;
    background-color: #fff;

    .P_Company {
      background-color: #EBF5FF;
      font-weight: 900;
      line-height: 40px;
      text-align: center;
      border-right: 1px solid #D8DFE7;
      box-sizing: border-box;
    }

    .P_CompanyName {
      padding-left: 100px;
      font-size: 14px;
      font-weight: 400;
      font-family: "Alibaba PuHuiTi";

    }


  }

  .peizhi {
    margin: 32px 0;
    display: flex;
    justify-content: space-between;

    .icon {
      background-color: #0285fd;
    }

    .pz_span {
      padding-right: 20px;
    }

    /deep/.el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 139px;
      height: 32px;
    }

    /deep/ .el-date-editor .el-input__inner {
      background-color: #EEF0F2;
      height: 32px;
    }

    .p_l_M {
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .p_export {

      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      // float: right;
      color: #fff;
      width: 85px;
      height: 32px;
      border-radius: 3px;
      opacity: 1;

      border: 1px solid rgba(0, 132, 255, 1);
      background: rgba(0, 132, 255, 1);
      cursor: pointer;
    }

    .p_right {
      align-self: end;
    }
  }

  .tableBody {

    color: #000000;

    /deep/ .el-table {
      color: #000;
    }

    /deep/ .el-table .el-table__body-wrapper .el-table__row--striped td.el-table__cell {
      background: #F8FCFF;
      border-color: #D8DFE7;
    }

    /deep/ .el-table .el-table__body-wrapper .el-table__row td.el-table__cell {
      border-color: #D8DFE7;
    }

    /deep/ .el-table__header-wrapper .has-gutter tr {
      background-color: #EBF5FF;
      border-color: #D8DFE7;
      color: #000000;



    }

    /deep/ .el-table th.el-table__cell {
      background-color: transparent;
      border-color: #D8DFE7;
      color: #000000
    }

    /deep/.el-table th.el-table__cell>.cell {
      display: flex;
      justify-content: center;
      align-items: center;

      :nth-child(0) {
        padding-left: 24px;
      }
    }

    /deep/ .el-table__footer-wrapper tbody td.el-table__cell {
      background-color: transparent;
      border-color: #D8DFE7;

      color: #000000;


    }

    /deep/ .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #D8DFE7;
    }


    .el-table--border:after,
    .el-table--group:after,
    .el-table:before {
      background-color: #D8DFE7;
    }

    .el-table--border,
    .el-table--group {
      border-color: #D8DFE7;
    }

    .el-table td,
    .el-table th.is-leaf {
      border-color: #D8DFE7;
    }

    .el-table--border th,
    .el-table--border th.gutter:last-of-type {
      border-color: #D8DFE7;
    }

    .el-table--border td,
    .el-table--border th {
      border-color: #D8DFE7;
    }
  }



}
</style>