import React, { useEffect, useState } from "react";
import { Table, Row, Col, Tooltip } from "antd";
import { queryTableData } from "../../api/asset";
import "./style.less";

const TableContainer = (props) => {
  // 配置项
  const { configuration } = props;
  // 右側求和
  const allSums = configuration.rightAllSum ? configuration.rightAllSum : ""
  // 右側是否顯示
  const rightShow = configuration.rightShow ? configuration.rightShow : true
  // 右側顯示字段
  const changeKey = configuration.rightShowField ? configuration.rightShowField : "roomName"
  console.log('allSums:', allSums, 'rightShow:', rightShow, "changeKey:", changeKey);

  // 单选多选
  const [selectionType, setSelectionType] = useState("checkbox");
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
    jsonObject: {
      assetId: "7bf9a997-5329-1507-f115-fcfa8dfdb1aa",
    },
  });

  // 处理配置项
  useEffect(() => {
    // 单选多选
    configuration.tableIsCheckBox
      ? setSelectionType("radio")
      : setSelectionType("checkbox");
    getTableData();
    console.log("queryForm", queryForm);
  }, []);

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
    console.log('tableData', tableData);
    return tableData;
  };

  // 获取表格数据
  const getTableData = async () => {
    // 处理表格列数据
    // let _showField = configuration.tableShowField;
    let _showField = [
      { key: "roomName", label: "房间名称" },
      { key: "floor", label: "楼层" },
      { key: "building", label: "楼栋" },
      { key: "buildingArea", label: "建筑面积(㎡)" },
      { key: "type", label: "状态" },
    ];
    let _showFieldList = [];
    _showField.forEach((item, index) => {
      let _showFieldObj = {
        title: item.label,
        dataIndex: item.key,
        align: "center",
        width: 80,
      };
      if (index === _showField.length - 1) {
        _showFieldObj.fixed = "right";
      }
      _showFieldList.push(_showFieldObj);
    });
    await setTableColumns(_showFieldList);

    // 处理表格行数据
    // queryTableData(queryForm).then((res) => {});
    let resData = {
      data: [
        [
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 1,
            col_name: "data_id",
            displayed: 1,
            id: "f8a96146-52d5-41f8-9ed3-86d3d0f49ba0",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
            queryable: 1,
          },
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 2,
            col_name: "roomName",
            displayed: 1,
            id: "4adc0960-0ee3-4343-a2bf-e4f646712192",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
          },
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 3,
            col_name: "floor",
            displayed: 1,
            id: "e4f1d4fc-8b31-4d18-b173-276b5b821de6",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
          },
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 4,
            col_name: "building",
            displayed: 1,
            id: "34d735a3-7822-4d3f-9368-faf91d4c25d6",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
          },
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 5,
            col_name: "buildingArea",
            displayed: 1,
            id: "046f0430-a07d-42f6-9ed3-b21f73778469",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
          },
          {
            asset_id: "d96aee4c-5d38-4292-acb2-f86322fe87b9",
            col_datatype: 0,
            col_index: 6,
            col_name: "type",
            displayed: 1,
            id: "f9b00ba6-415f-4de1-bb00-622cd26e1f28",
            import_flag: false,
            is_ciphertext: false,
            is_private: false,
            multipleComponentFlag: false,
          },
        ],
        [
          ["1001", "A座2栋1001", "A座2栋1层", "A座2栋", "500", "空置"],
          ["1002", "A座2栋1002", "A座2栋1层", "A座2栋", "500", "空置"],
          ["1003", "A座2栋1003", "A座2栋1层", "A座2栋", "500", "空置"],
          ["1004", "A座2栋1004", "A座2栋1层", "A座2栋", "500", "空置"],
          ["1005", "A座2栋1005", "A座2栋1层", "A座2栋", "500", "空置"],
          ["1006", "A座2栋1006", "A座2栋1层", "A座2栋", "500", "空置"],
        ],
        6,
      ],
    };
    let _resData = translatePlatformDataToJsonArray(resData);
    setTableData(_resData);
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
            tableSelectedRows.push(tableData[nums])
          }
        }
      }
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

  // 清除選中
  const allClear = ()=>{
    setSelectedRowKeys([]); 
    setTableSelectedRow([]); 
  }

  // 求和
  const addSum = (data)=> {
    let sumResult = 0
    data.reduce((preValue, curValue) =>{
      return sumResult = preValue + parseInt(curValue[allSums]);
    }, sumResult);
    return sumResult;
  };

  return (
    <Row className="zhyq_table_all">
      <Col span={rightShow ? 19 : 24}>
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
      </Col>
      {
        rightShow && (
          <Col span={5}>
            <div className="table_showList">
              <div className="topBox">
                <span>已选择{selectedRowKeys.length}个</span>
                <span className="allClear" onClick={allClear}>全部清除</span>
              </div>
              <div className="selectDataShow">
                {
                  tableSelectedRow.map(x => {
                    return (
                      <Tooltip key={x.data_id} placement="left" title={x[changeKey]}>
                        <div className="selectItem">{x[changeKey]}</div>
                      </Tooltip>
                    )
                  })
                }
              </div>
              {
                allSums !== "" && <div className="selectbottom">已选面积：{addSum(tableSelectedRow)} ㎡</div>
              }
            </div>
          </Col>
        )
      }
    </Row>
  );
};

export default TableContainer;
