import React, { useEffect, useState } from "react";
import { Table, Row, Col, Tooltip } from "antd";
import { queryTableData } from "../../api/asset";
import "./style.less";

const TableContainer = (props) => {
  // 配置项
  const { configuration } = props;
  // 单选多选
  const [selectionType, setSelectionType] = useState("checkbox");

  // 右侧求和字段
  const allSums = configuration.rightAllSum ? configuration.rightAllSum : "";
  // 右侧是否显示
  const rightShow = configuration.rightShow ? configuration.rightShow : false;
  // 右侧显示字段
  const changeKey = configuration.rightShowField
    ? configuration.rightShowField
    : "";

  // 表格列数据
  const [tableColumns, setTableColumns] = useState([]);
  // 表格行数据
  const [tableData, setTableData] = useState([]);
  // 表格分页
  const [tablePaging, setTablePaging] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 10,
  });
  // 表格选中数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableSelectedRow, setTableSelectedRow] = useState([]);
  // 表格查询条件
  const [queryForm, setQueryForm] = useState({
    queryCondition: {
      pageNum: tablePaging.page,
      pageSize: tablePaging.pageSize,
      queryParams: [],
    },
    jsonObject: {},
  });

  // 处理配置项
  useEffect(() => {
    // 单选多选
    configuration.tableIsCheckBox
      ? setSelectionType("checkbox")
      : setSelectionType("radio");
    getTableData(queryForm);
  }, [props?.configuration]);

  useEffect(() => {
    if (props.treeObj) {
      // 获取表格数据
      getTableData(queryForm, props.treeObj);
    }
  }, [props.treeObj]);

  useEffect(() => {
    let queryFormData = JSON.parse(JSON.stringify(queryForm));
    let queryParams = queryFormData.queryCondition.queryParams;
    // 处理重复筛选条件
    if (props.searchList.value) {
      queryParams.push(props.searchList);
      queryParams.forEach((item, index) => {
        if (
          item.colName == props.searchList.colName &&
          index != queryParams.length - 1
        ) {
          queryParams.splice(index, 1);
        }
      });
    } else {
      queryParams.forEach((item, index) => {
        if (item.colName == props.searchList.colName) {
          queryParams.splice(index, 1);
        }
      });
    }
    // 赋值
    setQueryForm(queryFormData);
    // 获取表格数据
    getTableData(queryFormData);
  }, [props.searchList]);

  // 获取表格数据
  const getTableData = async (queryFormData, treeData) => {
    if (treeData) {
      if (treeData.key) {
        if (configuration.treeSearchField) {
          queryFormData.jsonObject.filterFiled = configuration.treeSearchField;
          // queryFormData.jsonObject.filedValue = treeData.label;
          queryFormData.jsonObject.filedValue = treeData.key[0];
        }
      } else {
        queryFormData.jsonObject.filterFiled = "";
        queryFormData.jsonObject.filedValue = "";
      }
    }
    let _showFieldList = [];
    // 处理表格列字段
    if (configuration.tableShowField) {
      let _showField = JSON.parse(configuration.tableShowField);
      _showField.length &&
        _showField.forEach((item, index) => {
          let _showFieldObj = {
            title: item.label,
            dataIndex: item.key,
            align: "center",
            ellipsis: true,
            width: 80,
          };
          if (index === _showField.length - 1) {
            _showFieldObj.fixed = "right";
          }
          _showFieldList.push(_showFieldObj);
        });
      // 赋值列数据
      await setTableColumns(_showFieldList);
    }
    queryFormData.jsonObject.assetId = configuration.tableAssetId;
    // 处理表格行数据
    queryTableData(queryFormData).then((res) => {
      setTableData(res.data);
    });
  };

  // 选中行数据
  const rowSelection = {
    selectedRowKeys,
    onChange: (row) => {
      setSelectedRowKeys(row);
      let tableSelectedRows = [];
      for (let index = 0; index < row.length; index++) {
        for (let nums = 0; nums < tableData.length; nums++) {
          if (tableData[nums].data_id === row[index]) {
            tableSelectedRows.push(tableData[nums]);
          }
        }
      }

      props.saveSelectData(tableSelectedRows);
      setTableSelectedRow(tableSelectedRows);
    },
  };

  // 分页器改变
  const paginationChange = (page, pageSize) => {
    setTablePaging({
      totalCount: 0,
      page: page,
      pageSize: pageSize,
    });
  };

  // 清除选中
  const allClear = () => {
    setSelectedRowKeys([]);
    setTableSelectedRow([]);
  };

  // 求和
  const addSum = (data) => {
    let sumResult = 0;
    data.reduce((preValue, curValue) => {
      return (sumResult = preValue + parseInt(curValue[allSums]));
    }, sumResult);
    return sumResult;
  };

  return (
    <Row className="zhyq_table_all">
      <Col span={configuration.rightShow ? 19 : 24}>
        {tableData && (
          <Table
            bordered
            dataSource={tableData}
            columns={tableColumns}
            rowKey="data_id"
            scroll={{ x: 800 }}
            // 选择配置
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            // 分页配置
            pagination={{
              size: "middle",
              defaultCurrent: 1,
              current: tablePaging.page,
              pageSize: tablePaging.pageSize,
              pageSizeOptions: [10, 20, 50, 80, 100],
              total: tablePaging.totalCount,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条记录`,
              onChange: (page, pageSize) => paginationChange(page, pageSize),
            }}
          />
        )}
      </Col>
      {configuration.rightShow && (
        <Col span={5}>
          <div className="table_showList">
            <div className="topBox">
              <span>已选择{selectedRowKeys.length}个</span>
              <span className="allClear" onClick={allClear}>
                全部清除
              </span>
            </div>
            <div className="selectDataShow">
              {tableSelectedRow.map((x) => {
                return (
                  <Tooltip
                    key={x.data_id}
                    placement="left"
                    title={x[changeKey]}
                  >
                    <div className="selectItem">{x[changeKey]}</div>
                  </Tooltip>
                );
              })}
            </div>
            {allSums !== "" && (
              <div className="selectbottom">
                已选面积：{addSum(tableSelectedRow)} ㎡
              </div>
            )}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default TableContainer;
