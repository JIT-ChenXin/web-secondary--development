import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  ConfigProvider,
  Input,
  InputNumber,
  Select,
} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Tree from "../../common/Tree";
import Table from "../../common/Table";
import useTreeData from "../../common/hooks/useTreeData";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import "./style.less";
import { queryAssetData } from "../../api/asset";

const conditionMap = {
  等于: 2,
};
const Add = (props) => {
  const {
    data,
    onChange,
    formConfig,
    component,
    configuration: propsConfiguration,
    eventCenter,
    componentCenter,
  } = props;

  const { Option } = Select;

  const [configuration, setConfiguration] = useState({});
  const [visible, setVisible] = useState(false);

  const { treeState, setList, setTreeExpand, setTreeSelect } = useTreeData({
    configuration,
  });

  const { showBtn = false, btnName = "按钮" } = configuration;

  useEffect(() => {
    try {
      const configuration = JSON.parse(propsConfiguration);
      setConfiguration(configuration);
    } catch (error) {}
  }, []);

  //逻辑控制
  const triggerEventCenter = async ({ payload, event }) => {
    await eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component?.id,
      type: "report",
      event: event,
      payload: payload,
    });
  };

  const do_EventCenter_filterData = ({ list = [] }) => {
    const result = list.map((item) => {
      return {
        colName: item.name,
        type: conditionMap[item.condition] || 2,
        value: item.value,
      };
    });

    setList(result);
  };

  const Event_Center_getName = () => {
    return `${formConfig?.form_name}-${component.columnStyle.title}`;
  };

  // 事件中心注册挂载
  useDelegator(
    component?.id,
    { Event_Center_getName, do_EventCenter_filterData },
    eventActionDefine,
    formConfig?.id,
    null,
    -1,
    { eventCenter, componentCenter }
  );

  // tree
  const handleTreeExpand = (expandedKeys) => {
    setTreeExpand(expandedKeys);
  };

  const handleTreeSelect = (selectedKeys) => {
    setTreeSelect(selectedKeys);
  };

  //弹窗操作
  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const saveModal = () => {
    setVisible(false);
  };

  // 数据转换
  const translatePlatformDataToJsonArray = (originTableData) => {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  };

  const randerSearch = () => {
    console.log("add---生成搜索条件");

    let searchList = [
      {
        tag: "select",
        tagName: "园区名称",
        assetId: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
        showField: "",
        saveField: "",
      },
      {
        tag: "select",
        tagName: "仪表种类",
        assetId: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
        showField: "",
        saveField: "",
      },
      {
        tag: "number",
        tagName: "仪表号",
        assetId: "",
        showField: "",
        saveField: "",
      },
      {
        tag: "text",
        tagName: "仪表名称",
        assetId: "",
        showField: "",
        saveField: "",
      },
    ];

    let _domList = [];

    searchList.forEach((item, index) => {
      if (item.tag === "text") {
        _domList.push(
          <Row align="middle">
            <Col span={5}>{item.tagName}: </Col>
            <Col span={19}>
              <Input placeholder={`请输入${item.tagName}`} />
            </Col>
          </Row>
        );
      } else if (item.tag === "number") {
        _domList.push(
          <Row align="middle">
            <Col span={5}>{item.tagName}: </Col>
            <Col span={19}>
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={`请输入${item.tagName}`}
              />
            </Col>
          </Row>
        );
      } else if (item.tag === "select") {
        let resData = [];
        // queryAssetData(item.assetId).then((res) => {
        //   resData = translatePlatformDataToJsonArray(res);
        //   console.log("resData", resData);
        // });
        _domList.push(
          <Row align="middle">
            <Col span={5}>{item.tagName}: </Col>
            <Col span={19}>
              <Select
                style={{ width: "100%" }}
                placeholder={`请输入${item.tagName}`}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
          </Row>
        );
      }
    });

    return _domList;
  };

  const contentRender = () => {
    return (
      <ConfigProvider locale={zhCN}>
        <div className="tree-table-add">
          {/* 顶部组件 */}
          <Row gutter={[30, 15]} className="search_box">
            {randerSearch().map((item, index) => {
              return (
                <Col span={6} key={index}>
                  {item}
                </Col>
              );
            })}
          </Row>
          <Row gutter={18}>
            <Col span={5}>
              <Tree
                configuration={configuration}
                treeData={treeState.treeData}
                expandedKeys={treeState.expandedKeys}
                selectedKeys={treeState.selectedKeys}
                onExpand={handleTreeExpand}
                onSelect={handleTreeSelect}
              />
            </Col>
            <Col span={19}>
              <Table configuration={configuration} />
            </Col>
          </Row>
        </div>
      </ConfigProvider>
    );
  };
  if (showBtn) {
    return (
      <>
        <Button type="primary" onClick={showModal}>
          {btnName}
        </Button>
        {visible && (
          <Modal
            visible={visible}
            onCancel={closeModal}
            onOk={saveModal}
            okText={"确认"}
            cancelText={"取消"}
            width={1400}
          >
            {contentRender()}
          </Modal>
        )}
      </>
    );
  }

  return contentRender();
};

export default Add;
