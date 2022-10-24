<template>
  <div class="pn_outermost">
    <!-- 按钮组 -->
    <div class="header_box">
      <!-- 日期选择器 -->
      <div class="datepicker_button">
        <el-date-picker v-model="datePicke" type="date" size="small" placeholder="选择日期" :clearable="false" @change="changeDatePicker"></el-date-picker>
      </div>
      <!-- 导出 -->
      <div class="export_button">
        <img src="./assets/export.png" width="100%" height="100%" @click="exportEcharts()" />
      </div>
    </div>
    <!-- 柱状图 -->
    <div class="ehcarts_box">
      <div ref="echartsBar" id="pn_echarts_bar" style="width: 100%; height: 100%"></div>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <el-table :data="tableData" border :cell-style="tableRowClassName" :header-cell-style="{ background: '#ECF5FF' }">
        <el-table-column class-name="first_column" prop="time" label="时间" min-width="203" align="center"></el-table-column>
        <el-table-column class-name="second_column" prop="dispersion_rate" label="离散率（%）" min-width="138" align="center"></el-table-column>
        <el-table-column class-name="third_column" prop="current_p_avg" label="平均电流Ⅰ*（A）" min-width="175" align="center"></el-table-column>
        <template v-for="i in 24">
          <el-table-column v-if="columnIsShow(i)" :key="i" class-name="dynamic_column" :label="`Ⅰ*${i}（A）`" min-width="117" align="center">
            <template slot-scope="scope">
              <div :class="dispersionStyle(scope.row, i)">{{ scope.row[`PV${i}`] }}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
// 引入逻辑控制
import eventActionDefine from "./components/msgCompConfig";
// 引入公共封装方法
import utils from "@/utils";
// 引入接口方法
import { queryAssetByTime, getEcharts, exportEchartsExcel } from "./api/asset";
// 引入CSS文件
import "./index.css";
// 引入Jquery
import $ from "jquery";
// 引入图标
import dateicon from "./assets/date.png";
// 引入Echarts
import * as echarts from "echarts";
// 引入时间转换
import moment from "moment";

export default {
  name: "App",

  props: {
    customConfig: Object,
    sysVariables: Array,
    appVariables: Array,
  },

  data() {
    return {
      // 树形控件ID
      ids: "",
      // 日期选择器
      datePicke: new Date(),
      // 表格数据
      tableData: [],
      // 图表
      myChart: null,
      // 图表数据
      seriesData: [0, 0, 0, 0, 0],
    };
  },

  mounted() {
    // 用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);

    // 初始化图表
    this.initEcharts();
    // 添加图标
    this.addDatePickerIcon();

    if (process.env.NODE_ENV !== "production") {
      this.do_EventCenter_getIds({ value: "1" });
    }
  },

  methods: {
    // 生成Echarts
    initEcharts() {
      let myChart = echarts.init(document.getElementById("pn_echarts_bar"));
      this.myChart = myChart;
      let option = {};

      let xAxisData = [];
      let xAxisNameList = ["35%以上", "20%~35%", "10%~20%", "5%~10%", "5%以下"];
      xAxisNameList.forEach((item) => {
        xAxisData.push({
          value: item,
          textStyle: {
            color: "#333333",
            fontFamily: "Alibaba PuHuiTi",
            fontSize: 14,
            fontWeight: "400",
          },
        });
      });

      option = {
        // 悬浮框
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        // 整体
        grid: {
          top: "55px",
          left: "8px",
          right: "1px",
          bottom: "8px",
          containLabel: true,
        },
        // X轴
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#999999",
              },
            },
            offset: 7.32,
          },
        ],
        // Y轴
        yAxis: [
          {
            type: "value",
            minInterval: 5,
            name: "单位：次",
            nameTextStyle: {
              color: "#333333",
              fontFamily: "Alibaba PuHuiTi",
              fontSize: 12,
              fontWeight: "400",
              padding: [10, 0, 10, 0],
            },
            axisLabel: {
              color: "#333333",
              fontFamily: "Alibaba PuHuiTi",
              fontSize: 14,
              fontWeight: "400",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999999",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#E4E4E4",
              },
            },
          },
          {
            type: "value",
            axisLabel: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#878787",
              },
            },
            splitLine: { show: false },
          },
        ],
        // 数据
        series: [
          {
            type: "bar",
            barWidth: "35%",
            data: this.seriesData,
            itemStyle: {
              normal: {
                color: function (color) {
                  var colorList = ["#FF6E6C", "#FE9834", "#0893FD", "#A281F9", "#45D49F"];
                  return colorList[color.dataIndex];
                },
              },
            },
            label: {
              show: true,
              lineHeight: 10,
              formatter: "{c}",
              position: "top",
              offset: [0, -7],
              textStyle: {
                color: "#333333",
                fontFamily: "Alibaba PuHuiTi",
                fontSize: 14,
                fontWeight: "400",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },

    // 下载模板方法
    AsciiToString(asccode) {
      return String.fromCharCode(asccode);
    },
    // 下载模板方法
    UrlDecode(zipStr) {
      var uzipStr = "";
      for (var i = 0; i < zipStr.length; i += 1) {
        var chr = zipStr.charAt(i);
        if (chr === "+") {
          uzipStr += " ";
        } else if (chr === "%") {
          var asc = zipStr.substring(i + 1, i + 3);
          if (parseInt("0x" + asc) > 0x7f) {
            uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
            i += 8;
          } else {
            uzipStr += this.AsciiToString(parseInt("0x" + asc));
            i += 2;
          }
        } else {
          uzipStr += chr;
        }
      }
      return uzipStr;
    },
    // 导出Echarts
    exportEcharts() {
      let img = "";
      img = this.myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: "#fff",
      });

      let dataForm = {
        ids: this.ids,
        time: moment(this.datePicke).format("yyyy-MM-DD"),
        decode: img,
      };
      exportEchartsExcel(dataForm)
        .then((res) => {
          const temp = res.headers["content-disposition"].split("=")[1]; // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require("iconv-lite");
          iconv.skipDecodeWarning = true; //忽略警告
          let fileName = iconv.decode(temp, "utf-8");
          const _res = res.data;
          let blob = new Blob([_res]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          let fileNameNew = this.UrlDecode(fileName);
          downloadElement.download = fileNameNew; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch((err) => {
          console.log("下载失败", err);
        });
    },

    // 获取Echarts图表数据
    getEchartsData() {
      getEcharts(this.ids, moment(this.datePicke).format("yyyy-MM-DD")).then((res) => {
        let _res = res.data[0];
        this.seriesData = [_res.five, _res.four, _res.three, _res.two, _res.one];
        // 生成Echarts
        this.initEcharts();
      });
    },

    // 获取表格数据
    getTabelData() {
      queryAssetByTime(this.ids, moment(this.datePicke).format("yyyy-MM-DD")).then((res) => {
        let resData = JSON.parse(JSON.stringify(res.data));
        resData.forEach((item) => {
          if (item.time) {
            item.time = moment(item.tiem).format("yyyy-MM-DD HH:mm:ss");
          }
        });

        this.$nextTick(() => {
          this.tableData = resData;
          this.$forceUpdate();
        });
      });
    },

    // 切换日期
    changeDatePicker() {
      this.getTabelData();
      this.getEchartsData();
    },

    // 单元格变色
    dispersionStyle(row, index) {
      if (row[`PV${index}`] == 0) {
        return "coloumn_grey";
      }
      if (row[`PV${index}`]) {
        if (row.dispersion_rate > 10) {
          if ((row[`PV${index}`] - row.current_p_avg) / row.current_p_avg >= 20) {
            return "coloumn_red";
          } else {
            return "coloumn_white";
          }
        } else {
          return "coloumn_white";
        }
      }
    },

    // 是否展示列
    columnIsShow(index) {
      let dataObj = this.tableData[0];
      if (dataObj) {
        if (dataObj[`PV${index}`]) {
          return true;
        }
        if (dataObj[`PV${index}`] == "") {
          return true;
        }
        if (dataObj[`PV${index}`] == 0) {
          return true;
        }
        return false;
      }
      return false;
    },

    // 表格隔行变色
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 3) {
        if (columnIndex == 1) {
          if (row.dispersion_rate > 5 && row.dispersion_rate <= 10) {
            return { background: "#A281F9", color: "#fff" };
          } else if (row.dispersion_rate > 10 && row.dispersion_rate <= 20) {
            return { background: "#0893FD", color: "#fff" };
          } else if (row.dispersion_rate > 20 && row.dispersion_rate <= 35) {
            return { background: "#FE9834", color: "#fff" };
          } else if (row.dispersion_rate > 35) {
            return { background: "#FF6E6C", color: "#fff" };
          }
        }
        if (rowIndex % 2 == 0) {
          return "";
        } else {
          return { background: "#F9FCFF" };
        }
      }
    },

    // 添加日期选择器图标
    addDatePickerIcon() {
      let datepicker_icon = $(".el-input__suffix-inner > .el-input__icon");
      let iconDom = `<img src="${dateicon}" width="100%" height="100%" />`;
      datepicker_icon.append(iconDom);
    },

    // 触发动作
    do_EventCenter_getIds(value) {
      this.ids = value.value;

      // 获取表格数据
      this.getTabelData();
      // 获取Echarts图表数据
      this.getEchartsData();
    },

    // 注册组件名
    Event_Center_getName() {
      return "离散率";
    },
  },
  // 注销页面
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less">
// 最外层
.pn_outermost {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 25px 25px 28px 25px;
  // 头部盒子
  .header_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  // 日期选择器
  .datepicker_button {
    border-radius: 2px;
    margin-left: 2px;
    // 选择器整体
    .el-date-editor {
      cursor: pointer;
      width: 150px;
      height: 32px;
      border-radius: 2px;
      opacity: 1;
      border: 1px solid rgba(222, 222, 222, 1);
      background: rgba(239, 240, 243, 1);
      box-sizing: border-box;
    }
    // 选择器文字样式
    .el-input__inner {
      padding: 0;
      width: 88px;
      height: 22px;
      margin: 5px 50px 5px 12px;
      border: none;
      color: rgba(152, 153, 154, 1);
      background: #eff0f3;
      font-size: 16px;
      font-weight: 400;
      font-family: "Alibaba PuHuiTi";
      text-align: left;
    }
    // 左侧图标
    .el-input__prefix {
      display: none;
    }
    // 右侧图标
    .el-input__suffix {
      right: 0;
      left: 118px;
      width: 32px;
      height: 32px;
      top: -2.8px;
    }
  }
  // 导出按钮
  .export_button {
    width: 85px;
    height: 32px;
    cursor: pointer;
  }
  // ehcarts盒子
  .ehcarts_box {
    margin-left: -0.8px;
    margin-right: 25px;
    height: 418.09px;
    margin-bottom: 24.91px;
  }
  // 表格头部
  .el-table__header {
    // 头部单元格
    .el-table__cell {
      padding: 14px 0;
      height: 50px;
      color: #040404;
      font-size: 16px;
      font-weight: bold;
      font-family: "Alibaba PuHuiTi";
      box-sizing: border-box;
      // 头部单元格内元素
      .cell {
        padding: 0;
        margin: 0;
        height: 22px;
      }
    }
  }
  // 表格行
  .el-table__row {
    // 头部单元格
    .el-table__cell {
      padding: 0 !important;
      height: 40px;
      // 头部单元格内元素
      .cell {
        padding: 0;
        margin: 0;
        height: 100%;
        line-height: 38px;
      }
    }
  }
  // 表格底部横线
  .el-table::before {
    height: 0;
  }
  // 表格边框颜色
  .el-table--border,
  .el-table--group {
    border: 1px solid #d0dae4;
    // border-bottom: none;
  }
  // 表格内竖线颜色
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid #d0dae4;
  }
  // 表格内行线颜色
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d0dae4;
  }

  /* 滚动条的样式 */
  ::-webkit-scrollbar {
    height: 7px;
  }
  /* 滚动滑块的颜色 */
  ::-webkit-scrollbar-thumb {
    background-color: #1b85ff;
    border-radius: 5px;
  }
  /* 滚动条背景颜色 */
  ::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 5px;
  }
}

.coloumn_red {
  background: red;
  color: #ffffff;
  height: 100%;
}
.coloumn_white {
  background: #fff;
  color: #000000;
  height: 100%;
}
.coloumn_grey {
  background: #aaaaaa;
  color: #fff;
  height: 100%;
}
</style>
