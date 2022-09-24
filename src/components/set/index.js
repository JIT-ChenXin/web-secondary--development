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

  const [domList, setDomList] = useState([]);
  const [searchList, setSearchList] = useState({});

  useEffect(() => {
    try {
      let configuration = {};
      props?.component?.columnStyle?.customPluginConfig
        ? (configuration = JSON.parse(
            props?.component?.columnStyle?.customPluginConfig
          ))
        : (configuration = {});
      setConfiguration(configuration);
      randerSearch();
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

  // 渲染搜索条件
  const randerSearch = () => {
    if (props.configuration) {
      let configSet = JSON.parse(props.configuration);
      if (configSet.searchFieldList) {
        let _searchList = JSON.parse(configSet.searchFieldList);
        let _domList = [];

        _searchList.length &&
          _searchList.forEach((item, index) => {
            // 动态生成搜索条件
            if (item.tag === "select") {
              if (item.assetId) {
                queryAssetData(item.assetId).then((res) => {
                  let resData = translatePlatformDataToJsonArray(res);

                  _domList.push(
                    <Row align="middle">
                      <Col span={5}>{item.tagName}: </Col>
                      <Col span={19}>
                        <Select
                          style={{ width: "100%" }}
                          placeholder={`请输入${item.tagName}`}
                          allowClear
                        >
                          {resData.map((e, i) => {
                            return (
                              <Option key={index} value={e[item.saveField]}>
                                {e[item.showField]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  );
                });
              }
            } else if (item.tag === "text") {
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
            }
          });

        setDomList(_domList);
      }
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="tree-table-set">
        {/* 顶部组件 */}
        <Row gutter={[30, 15]} className="search_box">
          {JSON.stringify(domList) !== "[]" &&
            domList.map((item, index) => {
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
            <Table configuration={configuration} searchList={searchList} />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Set;
