import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { chainCertAuth, blockchainWrite } from "../api/asset";
import sha from "sha.js";
import * as getPersonalSm2VerifySign from "./vue-ca-sign.common.js";
import { Input, Select, Modal, message, Button } from "antd";
import { getSysVariableValues } from "../api/asset";

// const getPersonalSm2VerifySign = import('./vue-ca-sign.common.js')

const { Option } = Select;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

class WordOpenDetails extends Component {
  static propTypes = {
    form: PropTypes.object,
    onCancel: PropTypes.func,
    response_detail: PropTypes.object,
    setStateObj: PropTypes.func,
    logicExcute: PropTypes.func,
    modelId: PropTypes.string,
    dataId: PropTypes.string,
  };

  state = {
    dataSource: [],
    loading: false,
    userInfo: {},
  };

  async componentDidMount() {
    const { data } = await chainCertAuth();
    const { data: userInfo } = await getSysVariableValues();
    this.setState({
      dataSource: data,
      userInfo,
    });
  }

  save = () => {
    const { form, setStateObj, dataId, modelId, logicExcute } = this.props;
    const { dataSource, userInfo } = this.state;
    const { $current_user_id } = userInfo;
    this.setState({ loading: true });
    form.validateFields(async (err, values) => {
      if (!err) {
        let checkedData;
        dataSource.map((item) => {
          if (item.certId === values.certId) {
            checkedData = item;
          }
        });
        const mnemonic = sha("sha256").update(values.word).digest("hex");
        const certIdentityNumberHash =
          checkedData.certData.companyIdentityNumber;
        console.log(getPersonalSm2VerifySign);
        const data = await getPersonalSm2VerifySign.sm2.getMnemonic(
          mnemonic,
          certIdentityNumberHash
        );
        const imestamp = new Date().getTime();
        const passwordInfo =
          checkedData.userData.identityNumberHash +
          "-" +
          sha("sha256")
            .update(checkedData.certData.companyIdentityNumber)
            .digest("hex") +
          "-" +
          imestamp;
        const prvKeySign = await getPersonalSm2VerifySign.sm2.sm2Sign(
          data.currentPrv,
          passwordInfo
        );
        try {
          const { BLOCK_CHAIN_CONFIG = {} } = window.configuration || {};
          let blockChainConfig = BLOCK_CHAIN_CONFIG.current_value || "{}";
          try {
            blockChainConfig =
              typeof blockChainConfig === "string"
                ? JSON.parse(blockChainConfig)
                : blockChainConfig;
          } catch (error) {
            blockChainConfig = {};
          }
          const data = await blockchainWrite({
            dataId,
            modelId,
            type: 2,
            operationType: 1,
            examReportSign: prvKeySign,
            userId: $current_user_id,
            ...(blockChainConfig || {}),
          });
          if (data?.request?.response) {
            let response = JSON.parse(data.request.response);
            if (response.message) {
              message.success(response.message);
            }
          }
          this.setState({ loading: false });
          setStateObj(false);
          logicExcute();
        } catch (err) {
          this.setState({ loading: false });
          message.error(err);
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { form, response_detail, setStateObj } = this.props;
    const { dataSource, loading } = this.state;
    return (
      <Modal
        width={response_detail.width || 520}
        visible={true}
        closable={false}
        className="custom-wordOpen-modal"
        title="验证助记词"
        bodyStyle={{ height: response_detail.height || 520 }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setStateObj(false);
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.save}
          >
            确定
          </Button>,
        ]}
      >
        <Form layout={"Vertical"}>
          <FormItem
            className="analyzer-name"
            label={`请选择证书`}
            {...formItemLayout}
          >
            {form.getFieldDecorator("certId", {
              rules: [
                {
                  required: true,
                  message: `请选择证书`,
                },
              ],
            })(
              <Select className="analyzer-name-input">
                {dataSource.map((item, index) => {
                  return (
                    <Option value={item.certId} key={index}>
                      {item.certName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            className="catalog"
            label="请输入助记词"
            {...formItemLayout}
          >
            {form.getFieldDecorator("word", {
              rules: [
                {
                  required: true,
                  message: "必填",
                },
              ],
            })(
              <Input
                className="analyzer-name-input"
                placeholder="请输入助记词，例如我爱我的祖国"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(WordOpenDetails);
