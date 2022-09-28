import React, { useEffect } from "react";
import { Form, Input } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
  };

  return (
    <>
      <Form {...formItemLayout} form={form} onValuesChange={onFormLayoutChange}>
        <Form.Item label="单元表资产ID" name="assetID_1">
          <Input />
        </Form.Item>
        <Form.Item label="公摊表资产ID" name="assetID_2">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
