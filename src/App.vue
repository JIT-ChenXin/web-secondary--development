<template>
  <div className="analyzer-vue-demo" :style="{
    width: '100%',
    height: '100%',
  }" ref="multistageTable">
    <div v-if="dataSource && tableDataHeader && tableData" class="multistage">

      <el-table id="table" :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" align="center" type="index" class-name="ReachTable">
        </el-table-column>
        <el-table-column v-for="(item, index) in tHeader" align="center" :key="index"
          :prop="item.prop ? item.prop : null" :label="item.label" class-name="ReachTable">
          <template v-if="item?.children?.length != 0">
            <el-table-column v-for="(x, idx) in item.children" align="center" :key="idx" :prop="x.prop ? x.prop : null"
              :label="x.label">
              <template v-if="x.children">
                <el-table-column v-for="(x3, i) in x.children" align="center" :key="i" :prop="x3.prop ? x3.prop : null"
                  :label="x3.label" class-name="ReachTable">

                </el-table-column>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </el-table>
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
      headerBck: '#f8f8f8',
      headerColor: '',
      headerFontSize: '',
      headerFontWeight: '',
      headerFontFamily: '',
      bodyColor: '',
      bodyFontSize: '',
      bodyFontFamily: '',
      tHeader: [],
      tableData: [],
      confirmW: false
    };
  },
  computed: {
    tableDataHeader() {
      let temp = JSON.parse(JSON.stringify(this.dataSource[0]))
      temp.shift()
      let tempArr = temp || []
      let header = []
      for (let i = 0; i < tempArr.length; i++) {
        let t = tempArr[i]
        let frequency = t.split('_').length - 1
        if (frequency < 2) {
          this.$message({
            message: '不支持',
            type: 'error'
          });
          return
        }
        header.push({ prop: t, label: t })
      }
      return header

    },
    // tableData() {
    //   let [header, ...tableData] = this.dataSource;

    //   tableData = tableData || [];
    //   return tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
    // },
  },
  watch: {
    confirmW: {
      async handler(newV, oldV) {

        if (newV === true) {
          let reg = this.tableData.length

          await this.$nextTick(() => {
            const tds = document.querySelectorAll(
              `.multistage .el-table__body-wrapper .el-table__row:nth-of-type(${reg}) td`
            );
            tds[0].colSpan = 2;
            tds[0].style.textAlign = "center";
            tds[0].childNodes[0].childNodes[0].innerText = '总计'
            tds[1].style.display = "none";
          });
        }

      }
    }
  },
  mounted() {
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
    this.headerBck = this.options?.externalVariables?.background || '#f8f8f8'
    this.headerColor = this.options?.externalVariables?.headerColor || '#909399'
    this.headerFontFamily = this.options?.externalVariables?.headerFontFamily
    this.headerFontSize = this.options?.externalVariables?.headerFontSize || '14'
    this.headerFontWeight = this.options?.externalVariables?.headerFontWeight == 'true' ? 700 : 100

    this.bodyColor = this.options?.externalVariables?.bodyColor || '#606266'
    this.bodyFontFamily = this.options?.externalVariables?.bodyFontFamily
    this.bodyFontSize = this.options?.externalVariables?.bodyFontSize || '14'

    this.$refs.multistageTable.parentNode.style.height = "100%"
    this.$refs.multistageTable.parentNode.style.width = "100%"
    this.$refs.multistageTable.parentNode.parentNode.style.minHeight = "0"


    this.tHeader = this.dataFn()
    this.tableData = this.tableDataFn()

    this.$nextTick(() => {
      let temp = document.querySelectorAll('.multistage  .el-table thead.is-group th.el-table__cell')
      temp?.forEach((x, i) => {
        x.style.backgroundColor = this.headerBck
        x.style.fontWeight = this.headerFontWeight
        x.style.color = this.headerColor
        x.style.fontSize = this.headerFontSize + 'px'
        x.style.fontFamily = this.headerFontFamily

      })
      let Reach = document.querySelectorAll('.multistage  .el-table__body-wrapper .el-table__row .ReachTable')
      Reach?.forEach((x, i) => {

        x.style.color = this.bodyColor
        x.style.fontSize = this.bodyFontSize + 'px'
        x.style.fontFamily = this.bodyFontFamily
      })
    })


    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();



  },
  methods: {
    dataFn() {
      let a = {}
      let lastArr = []
      let splitArr = (this.dataSource[0] || []).map(x => {
        let i = x.split('_')
        return i
      })
      splitArr.forEach((x, i) => {
        let key = x[0]
        if (a[key] == undefined) {

          a[key] = { label: x[0], children: [{ label: x[1], ind: i }] }
          if (x[1] == undefined) { a[key] = { label: x[0], prop: x[0] } }

        } else {
          a[key].children.push({ label: x[1], ind: i })
        }
      })


      for (const key in a) {
        let b = []
        let a2 = {}
        a[key]?.children?.forEach(x => {
          let ke = x.label
          if (a2[ke] == undefined) {
            a2[ke] = { label: ke, children: [{ label: splitArr[x.ind][2], prop: this.dataSource[0][x.ind] }] }
          } else {
            a2[ke].children.push({ label: splitArr[x.ind][2], prop: this.dataSource[0][x.ind] })
          }
        })

        for (const key2 in a2) {
          b.push({ label: a2[key2].label, children: a2[key2].children })
        }
        a[key].children = b
        lastArr.push(a[key])

      }

      return lastArr

    },
    tableDataFn() {
      let [header, ...tableData] = this.dataSource;

      tableData = tableData || [];
      let tableReal = tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
      tableReal.forEach((x, i) => {
        for (const key in x) {
          let item = x[key]
          if (item == '总计') {
            this.confirmW = true
            let tempArr = tableReal.splice(i, 1)
            tableReal.push(...tempArr)
            break
          }
        }
      })
      console.log(tableReal);

      return tableReal
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "多级表头";
    },
  },
};
</script>

<style lang="less" scoped>
// .multistage {
//   padding: 20px 0;
// }

/deep/ .multistage .el-table thead.is-group th.el-table__cell {
  background: transparent;
}
</style>

