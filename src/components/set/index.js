import React, { useState, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input } from "antd";
import '../../index.css'
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
const { TextArea } = Input;
const Set = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const style = {
    width: "100%", height: "100%", borderColor: 'transparent', backgroundColor: 'transparent'
  }
  const defaultOptions = ['+', '-', '*', '/', '(', ')']
  const fieldOptions = ['面积', '单价', '公摊量', '单价', '金额', '系数']
  useDelegator(
    props.component.id,
    { Event_Center_getName },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  );

  const openWin = () => {

    setIsModalOpen(true)


  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const fieldClick = (x) => {

    let a = form.getFieldValue().text
    a += x
    form.setFieldsValue({ text: a })
  }
  const defaultClick = (x) => {
    let a = form.getFieldValue().text
    a += x
    form.setFieldsValue({ text: a })
  }
  return (<div className="set" > <button style={style} onClick={openWin} >'请配置费项计费公式'</button>


    <Modal forceRender title="配置区" open={isModalOpen} className='set_modal' centered footer={[
      <Button key="back" onClick={handleOk}>
        保存
      </Button>


    ]} onOk={handleOk} onCancel={handleCancel} style={{ height: '500px', width: '500px' }}>
      <div className='set_content'>
        <div className="fieldOptions" > {
          fieldOptions.map((x, i) => {
            return (<button key={i} onClick={() => { fieldClick(x) }} className='wisdomOptions' >{x}</button>)
          })
        }
        </div>
        <div className="deaflutOptions" > {
          defaultOptions.map((x, i) => {
            return (<button key={i} onClick={() => { defaultClick(x) }} className="wisdomOptions"  >{x}</button>)
          })
        }

        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button key="back" type="link" onClick={handleOk}>
            清空
          </Button>
        </div>
        <Form
          form={form}
        >
          <Form.Item name="text">
            <TextArea />
          </Form.Item>
        </Form>
      </div>
    </Modal></div>
  );
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
