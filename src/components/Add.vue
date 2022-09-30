<template>
  <div>
    <el-input v-if="dataState" v-model="data" @input="inputChange" :placeholder="configuration.placeholder" />
    <div class="counting" v-else>
      <el-button icon="el-icon-minus" @click="changButtonFn('-')" size="mini" :disabled="buttonState"></el-button>
      <div class="zhans">
        <div v-if='decimal'> {{decimal}} x 10<sup>{{pow}}</sup></div>{{emtpy}}
      </div>
      <el-button icon="el-icon-plus" @click="changButtonFn('+')" size="mini" :disabled="buttonState"></el-button>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      dataState: true,
      decimal: '',
      pow: '',
      emtpy: '',
      buttonState: false,

    };
  },
  mounted() {
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.configuration.num = this.configuration.radio == 1 ? this.configuration.num : (this.configuration.radio == 2 ? this.configuration.num - 1 : 3)
    } catch (error) {
      console.error("configuration解析错误", error);
    }

    if (this.customConfig.data) {
      this.dataState = false
      let result = this.toScientificNum(this.customConfig.data, this.configuration.num)
      if (result) {
        this.decimal = result[0]
        this.pow = result[1]
      } else {
        this.emtpy = result
        this.buttonState = true
      }
    }
  },
  methods: {
    async inputChange(e) {
      this.data = e;
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: e,
        },
      });
      onChange(e);
    },
    toScientificNum(num, digit = 3) {
      let number = Number(num)
      if (!number) return number
      let eformat = number.toExponential(digit);
      let tmpArray = eformat.match(/(.?\d\.?\d*)e(.?\d*)/);
      return [tmpArray[1], Number(tmpArray[2])];


    },
    changButtonFn(type) {

      if (type == '+') {
        this.configuration.num += 1
        let result = this.toScientificNum(this.customConfig.data, this.configuration.num)

        this.decimal = result[0]
        this.pow = result[1]
      } else {
        this.configuration.num -= 1
        let result = this.toScientificNum(this.customConfig.data, this.configuration.num)

        this.decimal = result[0]
        this.pow = result[1]
      }

    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    do_EventCenter_setValue({ value }) {
      this.data = value;
    },
    Event_Center_getName() {
      return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less" scoped>
.counting {
  display: flex;

  button {
    // border: #d9d9d9 1px solid;
    // background: #fff;
    // font-size: 18px;
  }

  .zhans {
    border: #d9d9d9 1px solid;
    border-left: none;
    border-right: none;
    background: #f5f5f5;
    line-height: 30px;
    text-align: center;
    height: 30px;
    // padding: 4px 0;

    div {
      line-height: 30px;
    }
  }
}
</style>
