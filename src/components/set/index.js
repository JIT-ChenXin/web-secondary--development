import React, { useState, useEffect } from "react";
import { Row, Col, ConfigProvider, Input, InputNumber, Select } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Tree from "../../common/Tree";
import Table from "../../common/Table";
import useTreeData from "../../common/hooks/useTreeData";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import "./style.less";
import { queryAssetData } from "../../api/asset";

const Set = (props) => {
  const [configuration, setConfiguration] = useState({});
  const { treeState } = useTreeData({ configuration });
  const { Option } = Select;

  useEffect(() => {
    try {
      let configuration = {};
      props?.component?.columnStyle?.customPluginConfig
        ? (configuration = JSON.parse(
            props?.component?.columnStyle?.customPluginConfig
          ))
        : (configuration = {});
      setConfiguration(configuration);
    } catch (e) {
      console.error(e);
    }
  }, [props?.component?.columnStyle?.customPluginConfig]);

  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };

  const Event_Center_getParentInfo = () => {
    return { scene: "dataForm" };
  };

  useDelegator(
    props.component?.id,
    { Event_Center_getName, Event_Center_getParentInfo },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: props.eventCenter, componentCenter: props.componentCenter }
  );

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
    console.log("set---生成搜索条件");
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

  return (
    <ConfigProvider locale={zhCN}>
      <div className="tree-table-set">
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
        {/* 底部组件 */}
        <Row gutter={18}>
          <Col span={5}>
            <Tree configuration={configuration} treeData={treeState.treeData} />
          </Col>
          <Col span={19}>
            <Table configuration={configuration} />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Set;
