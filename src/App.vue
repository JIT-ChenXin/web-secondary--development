<template>
  <div className="analyzer-vue-demo" :style="{
    width: '100%',
    height: '100%',
  }" ref="rock_div">
    <div ref="rockEcharts" class="rockEcharts">

    </div>
  </div>
</template>

<script>
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
const debounce = (func, ms) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}


import * as echarts from "echarts";
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      unit: '万',
      itemInner: {
        type: 'pie',
        radius: ['50%', '25%'],

        // radius: ['35%', '67%'],
        // center: ['50%', '50%'],
        // roseType: 'radius',
        data: [],
        // hoverAnimation: false,
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 4,
          },
        },
        label: {
          position: 'inner',
          formatter: ' {d|{d}%}',
          rich: {
            d: {                        //name 文字样式
              fontSize: 20,
              color: 'red',
              align: "center",
            },
          }
        },

      },
      itemOut: {
        type: 'pie',
        radius: ['50%', '25%'],

        // radius: ['35%', '67%'],
        // center: ['50%', '50%'],
        // roseType: 'radius',
        data: [
        ],

        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 4,
          },
        },
        labelLine: {
          normal: {

            length: 60,
            length2: 90,
            minTurnAngle: '120',
            lineStyle: {
              color: 'black',
            },
          },
        },
        label: {
          normal: {

            formatter: (params) => {
              return ' {value|' + this.formatNumber(params.value) + `${this.unit}}`;
            },
            // padding: [0, -120, 30, -120],
            rich: {


              value: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fff',
                align: 'left',
              },
              unit: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fff',
                align: 'left',
              }
            },
          },
        },


      },
      optionsE: {
        // backgroundColor: '#364686',
        // color: ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0'],
        title: [
          {
            text: '设备数',
            x: 'center',
            top: '40%',
            textStyle: {
              color: 'black',
              fontSize: 34,
              fontWeight: '100',

            },
          },

          {
            text: '60%',
            x: 'center',
            top: '46%',
            textStyle: {
              fontSize: 34,
              color: 'blue',
              foontWeight: '500',
            },
          },
          {
            text: '万元',
            x: 'center',
            top: '55%',
            textStyle: {
              color: 'black',
              fontSize: 12,
              fontWeight: '100',
            },
          },
        ],
        tooltip: {
          show: true,
          alwaysShowContent: true,
          className: 'huanx', borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.7)'
        },

        legend: {
          show: true, textStyle: { fontFamily: '微软雅黑', fontSize: 18, color: '#000' },
          top: 'bottom', icon: "circle", data: [], itemWidth: 15, itemHeight: 15, itemGap: 50
        },
        series: [
          {
            type: 'pie',
            radius: ['35%, 67%'],

            // radius: ['35%', '67%'],
            // center: ['50%', '50%'],
            roseType: 'radius',
            data: [],
            // hoverAnimation: false,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 4,
              },
            },
            label: {
              position: 'inner',
              formatter: ' {d|{d}%}',
              rich: {
                d: {                        //name 文字样式
                  fontSize: 20,
                  color: 'red',
                  align: "center",
                },
              }
            },

          },
          {
            type: 'pie',
            radius: ['35%, 67%'],

            // radius: ['35%', '67%'],
            // center: ['50%', '50%'],
            roseType: 'radius',
            data: [
              // {
              //   name: '设备1',
              //   value: '3720',
              // },
              {
                name: '设备2',
                value: '2920',
              },
              {
                name: '设备3',
                value: '2200',
              },
              // {
              //   name: '设备4',
              //   value: '1420',
              // },
              // {
              //   name: '设备5',
              //   value: '1420',
              // },
            ],

            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 4,
              },
            },
            labelLine: {
              normal: {
                length: 60,
                length2: 90,
                minTurnAngle: '120',
                lineStyle: {
                  color: 'black',
                },
              },
            },
            label: {
              normal: {
                formatter: (params) => {
                  return '{name|' + params.name + ':} {value|' + this.formatNumber(params.value) + `${this.unit}}`;
                },
                padding: [0, 0, 0, -120],
                rich: {

                  name: {
                    fontSize: 14,

                    // padding: [4, 0, 0, 0],
                    color: '#fff',
                  },
                  value: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                    align: 'left',
                  },
                },
              },
            },


          },

        ],
      }
    };
  },
  computed: {
    tableDataHeader() {
      return (this.dataSource[0] || []).map(t => ({
        prop: t,
        label: t,
      }));
    },
    tableData() {
      let [header, ...tableData] = this.dataSource;
      tableData = tableData || [];
      return tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
    },
    dataColor() {
      let 数据系列颜色 = this.options?.externalVariables?.数据系列颜色 || ''
      数据系列颜色 = 数据系列颜色.split(',')
      return 数据系列颜色
    },
    dataLabel() {
      let 数据标签字号 = this.options?.externalVariables?.数据标签字号
      let 数据标签颜色 = this.options?.externalVariables?.数据标签颜色
      let 数据标签字体 = this.options?.externalVariables?.数据标签字体
      let 数据标签加粗 = this.options?.externalVariables?.数据标签加粗 == 'true' ? "900" : "100"
      return { fontSize: 数据标签字号, color: 数据标签颜色, fontFamily: 数据标签字体, fontWeight: 数据标签加粗 }
    },
    titleStyle() {
      let 图标中间文字颜色上 = this.options?.externalVariables?.图标中间文字颜色上 || 'black'
      let 图标中间文字字号上 = this.options?.externalVariables?.图标中间文字字号上
      let 图标中间文字类型上 = this.options?.externalVariables?.图标中间文字类型上
      let 图标中间文字加粗上 = this.options?.externalVariables?.图标中间文字加粗上 == 'true' ? '900' : '100'
      let 图标中间文字颜色中 = this.options?.externalVariables?.图标中间文字颜色中 || 'black'
      let 图标中间文字字号中 = this.options?.externalVariables?.图标中间文字字号中
      let 图标中间文字类型中 = this.options?.externalVariables?.图标中间文字类型中
      let 图标中间文字加粗中 = this.options?.externalVariables?.图标中间文字加粗中 == 'true' ? '900' : '100'
      let 图标中间文字颜色下 = this.options?.externalVariables?.图标中间文字颜色下 || 'black'
      let 图标中间文字字号下 = this.options?.externalVariables?.图标中间文字字号下
      let 图标中间文字类型下 = this.options?.externalVariables?.图标中间文字类型下
      let 图标中间文字加粗下 = this.options?.externalVariables?.图标中间文字加粗下 == 'true' ? '900' : '100'
      return [{ fontSize: 图标中间文字字号上, color: 图标中间文字颜色上, fontFamily: 图标中间文字类型上, fontWeight: 图标中间文字加粗上 }, { fontWeight: 图标中间文字加粗中, fontSize: 图标中间文字字号中, color: 图标中间文字颜色中, fontFamily: 图标中间文字类型中 },
      { fontSize: 图标中间文字字号下, color: 图标中间文字颜色下, fontFamily: 图标中间文字类型下, fontWeight: 图标中间文字加粗下 }]
    },
    ringStyle() {
      let 环内百分比字号 = this.options?.externalVariables?.环内百分比字号
      let 环内百分比颜色 = this.options?.externalVariables?.环内百分比颜色 || '#fff'
      let 环内百分比字体 = this.options?.externalVariables?.环内百分比字体
      return { fontSize: 环内百分比字号, color: 环内百分比颜色, fontFamily: 环内百分比字体 }
    },
    spacing() {
      let 环间距 = this.options?.externalVariables?.环间距 || 10
      return 环间距
    },
    titleText() {
      let 图标中间标题上 = this.options?.externalVariables?.图标中间标题上 || '服务收入'
      let 图标中间标题下 = this.options?.externalVariables?.图标中间标题下 || '万元'
      return { titleT: 图标中间标题上, titleB: 图标中间标题下 }
    },
    lineStyle() {
      let 标签线第一段的长度 = this.options?.externalVariables?.标签线第一段的长度 || 60
      let 标签线第二段的长度 = this.options?.externalVariables?.标签线第二段的长度 || 140
      let 标签线颜色 = this.options?.externalVariables?.标签线颜色 || 'black'
      let 标签线夹角 = this.options?.externalVariables?.标签线夹角 || '120'
      return {
        length: 标签线第一段的长度, length2: 标签线第二段的长度, color: 标签线颜色, minTurnAngle: 标签线夹角
      }
    },
    radius() {
      // let 饼图的半径 = this.options?.externalVariables?.饼图的半径 || '50%, 25%'
      let 饼图的半径 = this.options?.externalVariables?.饼图的半径 || '35%, 67%'

      return 饼图的半径.split(',')
    },
    accuracy() {
      let 精确度 = this.options?.externalVariables?.精确度 || '2'
      return 精确度
    },
    gradient() {
      let 渐变色 = this.options?.externalVariables?.渐变色 || ''
      try {
        渐变色 = JSON.parse(渐变色)
      } catch (error) {
        console.log(error);
      }
      return 渐变色
    },
    legendOptions() {
      let size = this.options?.externalVariables?.图例大小 || 15
      let fontSize = this.options?.externalVariables?.图例字体大小
      let itemgap = this.options?.externalVariables?.图例间距 || 20
      return { size: Number(size), fontSize, itemgap: Number(itemgap) }
    },
    tooltipOptions() {
      let fontIcon = this.options?.externalVariables?.提示框图例大小
      let fontTitle = this.options?.externalVariables?.提示框标题大小
      let fontValue = this.options?.externalVariables?.提示框值大小
      return { fontIcon, fontTitle, fontValue }
    },

  },
  created() {
    this.unit = this.options?.externalVariables?.单位 || '万'
    let tableD = JSON.parse(JSON.stringify(this.dataSource))
    console.log(this.dataSource, '====');
    if (this.dataSource && this.dataSource?.length > 0) {
      tableD.shift()
      let tableD1 = this.dataFn(tableD)


      let a = []
      for (let x = 0; x < tableD1[0].length; x++) {
        let temp = []
        tableD1.forEach(item => {
          temp.push(item[x])
        })
        a.push(temp)
      }

      let scaleData = [];
      let sum = 0

      if (this.gradient) {
        a[0].forEach((x, i) => {
          let colorArr = this.gradient[i] || ['', '']

          colorArr[1] = colorArr[1] ? colorArr[1] : colorArr[0]
          let color
          if (colorArr[0]) {
            color = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              {
                offset: 0,
                color: colorArr[0],
              },
              {
                offset: 1,
                color: colorArr[1],
              },
            ])

          } else {
            color = null
          }
          sum += Number(x)
          scaleData.push({
            value: x,
            name: a[1][i],
            itemStyle: {
              color
            }
          })
        })
      } else {
        a[0].forEach((x, i) => {
          let color = this.dataColor[i] || null
          sum += Number(x)
          scaleData.push({
            value: x,
            name: a[1][i],
            itemStyle: { color }
          })
        })
      }
      tableD1.forEach((x, i) => {
        let colorArr = this.gradient[i] || ['', '']
        this.optionsE.legend.data.push({ name: x[1], itemStyle: { color: colorArr[0] || this.dataColor[i] || null } })
      })

      let accuracy = this.accuracy
      let sumT = String(sum).indexOf('.') == -1 ? sum : sum.toFixed(2)
      this.optionsE.title[1].text = sumT
      this.optionsE.title[0].text = this.titleText.titleT
      this.optionsE.title[2].text = this.titleText.titleB

      let that = this
      scaleData.forEach((x, i) => {
        let temD = JSON.parse(JSON.stringify(scaleData))
        let itemInner = JSON.parse(JSON.stringify(this.itemInner))
        let itemOut = JSON.parse(JSON.stringify(this.itemOut))
        scaleData.forEach((y, idx) => {

          if (i != idx) {
            temD[idx].itemStyle.color = 'transparent'
            temD[idx].itemStyle.borderColor = 'transparent'
            temD[idx].itemStyle.optionColor = y.itemStyle?.color?.colorStops[0]?.color || y.itemStyle?.color
          }
        })

        itemInner.data = temD
        itemOut.data = temD

        itemOut.label.normal.formatter = (params) => {
          return ' {value|' + that.formatNumber(params.value) + `}` + `{unit| ${that.unit} }`;
        }
        let towR = Number(that.radius[1].replace('%', ''))
        itemInner.radius = [that.radius[0], towR + i * 5 + '%']
        itemOut.radius = [that.radius[0], towR + i * 5 + '%']
        itemInner.itemStyle.normal.borderWidth = that.spacing
        itemOut.itemStyle.normal.borderWidth = that.spacing
        itemInner.label.rich.d = that.ringStyle
        itemInner.zlevel = 1
        itemOut.label.normal.show = false
        itemOut.labelLine.show = false
        let unitStyle = JSON.parse(JSON.stringify(that.dataLabel))
        delete unitStyle.fontWeight
        itemOut.label.normal.rich.unit = unitStyle
        itemOut.label.normal.rich.value = that.dataLabel
        itemOut.labelLine.normal.length = that.lineStyle.length
        itemOut.labelLine.normal.length2 = that.lineStyle.length2
        itemOut.labelLine.normal.minTurnAngle = that.lineStyle.minTurnAngle
        itemOut.labelLine.normal.lineStyle.color = that.lineStyle.color
        this.optionsE.series[i * 2] = itemInner
        this.optionsE.series[i * 2 + 1] = itemOut
      })
      let cd = this.optionsE.series.length - 1
      this.optionsE.series[cd].label.normal.show = true
      this.optionsE.series[cd - 1].label.show = false
      this.optionsE.series[cd - 1].data.forEach((x, i) => {

        x.itemStyle.color != 'transparent' ? x.label = { show: true } : null

      })
      this.optionsE.series[cd].labelLine.show = true
      this.optionsE.series[cd].zlevel = -1
      this.optionsE.series[0].label.formatter = function (name) {


        const p = ((name.value / sum) * 100).toFixed(accuracy);
        return `{d| ${p}%} `
      }
      // this.optionsE.series[0].data = scaleData
      // this.optionsE.series[1].data = scaleData
      // this.optionsE.series[0].itemStyle.normal.borderWidth = this.spacing
      // this.optionsE.series[1].itemStyle.normal.borderWidth = this.spacing
      let unit = this.unit
      this.optionsE.legend.textStyle.fontSize = this.legendOptions.fontSize
      this.optionsE.legend.itemWidth = this.legendOptions.size
      this.optionsE.legend.itemHeight = this.legendOptions.size
      this.optionsE.legend.itemGap = this.legendOptions.itemgap

      let font = this.tooltipOptions
      this.optionsE.tooltip.formatter = function (params) {

        let color1 = params.data.itemStyle?.optionColor || params.color?.colorStops[0]?.color
        let res = `<div  class= 'pin' style=' color:${color1};font-size:${font.fontIcon}'>●&nbsp </div>` + `<span  class="textTile" style='font-size:${font.fontTitle}' >` + params.name + "</span>" + "<br>" +
          `<div  class='flex' style='font-size:${font.fontValue}'   >` + `<div>` + params?.value + ` </div>` + `<div  class='end' >` + unit + `</div>` + `</div>` + `</div>`



          // `<div  class= 'pin' style=' color:${color1};'>●&nbsp </div>` +
          // "自发自用电量: " +
          // params[0].data +




          ;

        return '<div class="showBox"    >' + res + "</div>";
      }
      this.optionsE.title.forEach((x, i) => {
        x.textStyle = this.titleStyle[i]
      })
    }


  },

  mounted() {
    this.$refs.rock_div.parentNode.style.height = "100%"
    this.$refs.rock_div.parentNode.style.width = "100%"
    this.$refs.rock_div.parentNode.parentNode.style.minHeight = "0"
    if (this.dataSource && this.dataSource?.length > 0) {
      this.initFn();
    }

    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
  },
  methods: {
    initFn() {
      let Gechart = echarts.init(this.$refs.rockEcharts, null, { devicePixelRatio: 1, renderer: 'svg' });

      Gechart.setOption(this.optionsE);
      this.optionsE && Gechart.setOption(this.optionsE);
      const task = () => {
        Gechart.resize();
      };
      window.addEventListener("resize", debounce(task, 300));
    },
    dataFn(arr) {
      let a = {}
      let b = []
      arr.forEach(x => {
        let key = x[0]
        if (a[key] >= 0) {
          a[key] += Number(x[1])
        } else {
          a[key] = Number(x[1])
        }
      })
      let i = 0
      for (let key in a) {
        b[i] = [Number(a[key].toFixed(2)), key]
        i++
      }
      b.sort(function (a, b) {
        return b[0] - a[0]
      })

      return b
    },
    formatNumber(num) {
      let reg = /(?=(\B)(\d{3})+$)/g;
      return num.toString().replace(reg, ',');
    },
    clickBt() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onClick", {
          name: "二开插件",
        });
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "磐能环形表";
    },
    do_EventCenter_messageSuccess(param) {
      console.log(param);
      alert("动作执行成功！");
    },
  },
};
</script>



<style lang="less" scoped>
.rockEcharts {
  height: 100%;


}
</style>
