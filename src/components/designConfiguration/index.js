import React, { useEffect, useState } from "react";
import { Select, Input, Switch, Row, Col } from "antd";
import { queryAssetData } from "../../api/asset";
import "./style.less";

const DesignConfiguration = (props) => {
  const { Option } = Select;

  const {
    changeConfiguration = () => {},
    configuration: propsConfiguration = "",
  } = props;
  const [configuration, setConfiguration] = useState({});
  const [assetColumns, setAssetColumns] = useState([]);

  const { showBtn = false, btnName = "按钮" } = configuration;

  useEffect(() => {
    try {
      const configuration = JSON.parse(propsConfiguration);
      setConfiguration(configuration);
      if (configuration.treeAssetId) {
        initAssetColumns(configuration.treeAssetId);
      }
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const initAssetColumns = async (asset_id) => {
    if (asset_id && asset_id !== "") {
      try {
        const { data } = await queryAssetData(asset_id, [], 0);
        const columns = data[0] || [];
        const result = columns.map((item) => {
          return {
            value: item.col_name,
            label: item.col_name,
          };
        });
        setAssetColumns([...result]);
      } catch (e) {}
    }
  };

  const onValueChange = (key, value) => {
    configuration[key] = value;
    setConfiguration({ ...configuration });
    changeConfiguration(JSON.stringify(configuration));
  };

  const treeRender = () => {
    const {
      treeAssetId = "",
      treeHeight = "",
      treeTitle = "",
      treeDataId = "",
      treeParentId = "",
      treeMultLayer = false,
      treeFilter = true,
      tableAssetId = "",
      tableShowField = "",
      searchFieldList = "",
      treeSearchField = "",
      tableIsCheckBox = "",
      rightShowField = "",
      rightAllSum = "",
      rightShow = true,
    } = configuration;
    return (
      <>
        <Row>
          <Col span={12}>树配置</Col>
        </Row>
        <Row>
          <Col span={12}>树高度</Col>
          <Col span={12}>
            <Input
              value={treeHeight}
              onChange={(e) => {
                onValueChange("treeHeight", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>目录资产</Col>
          <Col span={12}>
            <Input
              value={treeAssetId}
              onChange={(e) => {
                onValueChange("treeAssetId", e.target.value);
                initAssetColumns(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>目录标题 </Col>
          <Col span={12}>
            <Select
              value={treeTitle}
              onChange={(e) => {
                onValueChange("treeTitle", e);
              }}
            >
              {assetColumns.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={12}>目录字段 </Col>
          <Col span={12}>
            <Select
              value={treeDataId}
              onChange={(e) => {
                onValueChange("treeDataId", e);
              }}
            >
              {assetColumns.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={12}> 父节点字段</Col>
          <Col span={12}>
            <Select
              value={treeParentId}
              onChange={(e) => {
                onValueChange("treeParentId", e);
              }}
            >
              {assetColumns.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={12}>开启多层 </Col>
          <Col span={12}>
            <Switch
              checked={treeMultLayer}
              onChange={(e) => {
                onValueChange("treeMultLayer", e);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>园区权限过滤 </Col>
          <Col span={12}>
            <Switch
              checked={treeFilter}
              onChange={(e) => {
                onValueChange("treeFilter", e);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>列表配置</Col>
        </Row>
        <Row>
          <Col span={12}>列表资产</Col>
          <Col span={12}>
            <Input
              value={tableAssetId}
              onChange={(e) => {
                onValueChange("tableAssetId", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>显示字段</Col>
          <Col span={12}>
            <Input
              value={tableShowField}
              onChange={(e) => {
                onValueChange("tableShowField", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>搜索条件</Col>
          <Col span={12}>
            <Input
              value={searchFieldList}
              onChange={(e) => {
                onValueChange("searchFieldList", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>目录过滤列表字段</Col>
          <Col span={12}>
            <Input
              value={treeSearchField}
              onChange={(e) => {
                onValueChange("treeSearchField", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>是否多选</Col>
          <Col span={12}>
            <Switch
              checked={tableIsCheckBox}
              onChange={(e) => {
                onValueChange("tableIsCheckBox", e);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>右侧配置</Col>
        </Row>
        <Row>
          <Col span={12}>显示字段</Col>
          <Col span={12}>
            <Input
              value={rightShowField}
              onChange={(e) => {
                onValueChange("rightShowField", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>自动求和字段</Col>
          <Col span={12}>
            <Input
              value={rightAllSum}
              onChange={(e) => {
                onValueChange("rightAllSum", e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>是否展示右侧</Col>
          <Col span={12}>
            <Switch
              checked={rightShow}
              onChange={(e) => {
                onValueChange("rightShow", e);
              }}
            />
          </Col>
        </Row>
      </>
    );
  };
  return (
    <div className="tree-table-design">
      <Row>
        <Col span={12}>开启弹窗 </Col>
        <Col span={12}>
          <Switch
            checked={showBtn}
            onChange={(e) => {
              onValueChange("showBtn", e);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>弹窗按钮名称 </Col>
        <Col span={12}>
          <Input
            value={btnName}
            onChange={(e) => {
              onValueChange("btnName", e.target.value);
            }}
          />
        </Col>
      </Row>
      {treeRender()}
    </div>
  );
};

export default DesignConfiguration;
