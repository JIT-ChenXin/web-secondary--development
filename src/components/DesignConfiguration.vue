<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="选择">
      <el-radio-group v-model="form.radio">
        <el-radio :label="1">小数位</el-radio>
        <el-radio :label="2">有效位数</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="label1" v-if="visble">
      <el-input-number v-model="form.num" controls-position="right" :min="1">
      </el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {

      form: {
        radio: undefined,
        num: 3, label1: '选择小数位'
      },
      visble: null,

    };
  },

  watch: {
    "form.size": function (value, oldValue) {

      this.onFormLayoutChange();
    },
    "form.radio": function (value, oldValue) {
      this.onFormLayoutChange();
      this.visble = value
      this.label1 = value == 1 ? '选择小数位' : '选择有效位数'
    },
    "form.num": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  props: {
    customConfig: Object,
  },
  methods: {
    onFormLayoutChange() {
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
    },
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || '{"radio":"","num":3}');
    console.log(Boolean(this.form.radio), this.form.radio)

  },
};
</script>
