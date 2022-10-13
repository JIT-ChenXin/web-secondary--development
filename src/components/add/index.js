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

  const [domList, setDomList] = useState([]);
  const [searchList, setSearchList] = useState({});

  const { treeState, setList, setTreeExpand, setTreeSelect } = useTreeData({
    configuration,
  });

  const [treeObj, setTreeObj] = useState("");

  const { showBtn = false, btnName = "按钮" } = configuration;

  useEffect(() => {
    try {
      const configuration = JSON.parse(propsConfiguration);
      setConfiguration(configuration);
      randerSearch();
    } catch (error) {}
  }, []);

  const [selectData, setSelectData] = useState([]);

  //逻辑控制
  const triggerEventCenter = async (targetValue) => {
    let triggerObj = {
      objectId: formConfig?.id,
      componentId: component?.id,
      type: "report",
      event: "change",
      payload: {
        value: targetValue,
      },
    };

    await eventCenter.triggerEventNew(triggerObj);
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

  const handleTreeSelect = (selectedKeys, info) => {
    if (selectedKeys.length) {
      setTreeObj({ key: selectedKeys, label: info.node.title });
    } else {
      setTreeObj({});
    }
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
    triggerEventCenter(selectData);
    setVisible(false);
  };

  // 保存选中行数据
  const saveSelectData = (arr) => {
    if (!showBtn) {
      triggerEventCenter(arr);
    }
    setSelectData(arr);
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

  // 触发搜索
  const changeSearch = (field, value, tag) => {
    let searchObj = {};
    // 判断精准查询还是模糊查询
    if (tag == "text" || tag == "number") {
      searchObj.type = 0;
    } else {
      searchObj.type = 1;
    }
    searchObj.colName = field;
    searchObj.value = value;

    setSearchList(searchObj);
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

                  _domList[item.index] = (
                    <Row align="middle">
                      <Col span={6}>{item.tagName}: </Col>
                      <Col span={18}>
                        <Select
                          style={{ width: "100%" }}
                          placeholder={`请输入${item.tagName}`}
                          onChange={(e) =>
                            changeSearch(item.saveField, e, item.tag)
                          }
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
              _domList[item.index] = (
                <Row align="middle">
                  <Col span={6}>{item.tagName}: </Col>
                  <Col span={18}>
                    <Input
                      placeholder={`请输入${item.tagName}`}
                      onBlur={(e) =>
                        changeSearch(item.saveField, e.target.value, item.tag)
                      }
                    />
                  </Col>
                </Row>
              );
            } else if (item.tag === "number") {
              _domList[item.index] = (
                <Row align="middle">
                  <Col span={6}>{item.tagName}: </Col>
                  <Col span={18}>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder={`请输入${item.tagName}`}
                      onBlur={(e) =>
                        changeSearch(item.saveField, e.target.value, item.tag)
                      }
                    />
                  </Col>
                </Row>
              );
            }
          });

        setTimeout(() => {
          setDomList(_domList);
        }, 1000);
      }
    }
  };

  const contentRender = () => {
    return (
      <ConfigProvider locale={zhCN}>
        <div className="tree-table-add">
          {/* 顶部组件 */}
          <Row gutter={[25, 15]} className="search_box">
            {JSON.stringify(domList) !== "[]" &&
              domList.map((item, index) => {
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
              <Table
                configuration={configuration}
                searchList={searchList}
                treeObj={treeObj}
                saveSelectData={saveSelectData}
                modalVisible={visible}
                formConfig={formConfig}
                component={component}
                eventCenter={eventCenter}
              />
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
