<template>
  <div class="preview-root"><span v-if='decimal'>{{decimal}}x10<sup>{{pow}}</sup></span>{{emtpy}} </div>
</template>

<script>
export default {
  name: "Preview",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      decimal: '',
      pow: '',
      emtpy: ''
    };
  },
  mounted() {
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.configuration.num = this.configuration.radio == 1 ? this.configuration.num : (this.configuration.radio == 2 ? this.configuration.num - 1 : 3)
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    if (this.customConfig.data) {
      let result = this.toScientificNum(this.customConfig.data, this.configuration.num)
      if (result) {
        this.decimal = result[0]
        this.pow = result[1]
      } else {
        this.emtpy = result
      }
    }
  },
  methods: {
    toScientificNum(num, digit = 3) {
      let number = Number(num)
      if (!number) return number
      let eformat = number.toExponential(digit);
      let tmpArray = eformat.match(/(.?\d\.?\d*)e(.?\d*)/);
      return [tmpArray[1], Number(tmpArray[2])];


    }

  },
};
</script>

<style lang="less" scoped>
.preview-root {
  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  color: #606266;
}
</style>
