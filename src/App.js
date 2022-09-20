import React, { Component } from "react";
import moment from "moment";
import {
  Button,
  Radio,
  DatePicker,
  ConfigProvider,
  Table,
  message,
} from "antd";
import "moment/locale/zh-cn";
import "./app.less";
import zhCN from "antd/lib/locale/zh_CN";
import { queryMonth } from "./api/asset";
import axios from "axios";

const options = [
  {
    label: "月报",
    value: "month",
  },
  {
    label: "年报",
    value: "year",
  },
];
const monthColumns = [
  {
    title: "月份",
    dataIndex: "date",
    width: "10%",
    // render: (text) => <a>{text}</a>,
    align: "center",
  },
  {
    title: () => (
      <span>
        发电量
        <br />
        (万kWh)
      </span>
    ),
    className: "column-money",
    dataIndex: "powerOutput",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        上网电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerOngrid",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电费
        <br />
        (万元)
      </span>
    ),
    dataIndex: "feesSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
];
const yearColumns = [
  {
    title: "年份",
    dataIndex: "date",
    width: "10%",
    // render: (text) => <a>{text}</a>,
    align: "center",
  },
  {
    title: () => (
      <span>
        发电量
        <br />
        (万kWh)
      </span>
    ),
    className: "column-money",
    dataIndex: "powerOutput",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        上网电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerOngrid",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电费
        <br />
        (万元)
      </span>
    ),
    dataIndex: "feesSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
];

export default class App extends Component {
  componentDidMount() {
    const events = [
      {
        key: "jumpButton",
        name: "跳转按钮",
        payload: [],
      },
    ];

    const actions = [
      {
        key: "queryData",
        name: "查询数据",
        params: [{ name: "id", dataType: "string", key: "id" }],
      },
    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );

    this.setState(
      {
        firstDate: moment().startOf("year"),
        secondDate: moment(),
      },
      () => this.queryData()
    );
    // this.do_EventCenter_queryData();
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }
  state = {
    id: undefined,
    dataSource: [],
    //服务单位
    // customerServiceUnit: "",
    tabValue: "month",
    firstDate: undefined,
    secondDate: undefined,
  };
  goToStudy = () => {
    this.props?.customConfig?.url && window.open(this.props?.customConfig?.url);
  };

  do_EventCenter_queryData({ id }) {
    console.log("id: ", id);
    //目录点击操作
    this.setState({ id }, () => {
      this.queryData();
    });
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "月报";
  }
  queryData = async () => {
    const { tabValue, id, firstDate, secondDate } = this.state;
    if (tabValue === "month" && id) {
      let first = "";
      let second = "";
      if (firstDate) {
        first = moment(firstDate).format("YYYY-MM");
      }
      if (secondDate) {
        second = moment(secondDate).format("YYYY-MM");
      }
      let date = [];
      if (first) date.push(first);
      if (second) date.push(second);
      if (date.length === 2) {
        const { data } = await queryMonth({
          type: tabValue,
          date,
          customerServiceUnitId: id,
        });
        this.setState({
          name: data.customerServiceUnit,
          dataSource: data.propertyList,
        });
      }
    }
    if (tabValue === "year" && id) {
      const { data } = await queryMonth({
        type: tabValue,
        date: [],
        customerServiceUnitId: id,
      });
      this.setState({
        name: data.customerServiceUnit,
        dataSource: data.propertyList,
      });
    }
  };
  // tab切换方法
  onChangeTabValue = ({ target: { value } }) => {
    this.setState({ dataSource: [] }, () => {
      this.setState({ tabValue: value }, () => this.queryData());
    });
  };
  //表格头部渲染
  titleRenderer = () => {
    return (
      <>
        <div className="title">服务单位</div>
        <div className="content">{this.state.name}</div>
      </>
    );
  };
  // 第一个日期框选择方法
  onFirstDatePickerChange = (value) => {
    this.setState({ firstDate: value }, () => this.queryData());
    // 查询方法
  };
  //第二个日期框选择方法
  onSecondDatePickerChange = (value) => {
    this.setState({ secondDate: value }, () => this.queryData()); // 查询方法
  };
  // 导出方法
  onExportClick = () => {
    const { tabValue, id, firstDate, secondDate } = this.state;
    let date = [];
    let fineName = tabValue === "month" ? "月报" : "年报";
    if (tabValue === "month") {
      let first = "";
      let second = "";
      if (firstDate) {
        first = moment(firstDate).format("YYYY-MM");
      }
      if (secondDate) {
        second = moment(secondDate).format("YYYY-MM");
      }
      if (first) date.push(first);
      if (second) date.push(second);
      if (date.length !== 2) {
        message.warning("请选择日期");
        return;
      }
    }
    axios
      .post(
        "/sdata/rest/electricitySettlement/export",
        {
          type: tabValue,
          customerServiceUnitId: id,
          date,
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.ms-excel",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fineName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        message.error(error || "下载数据失败！");
      });
  };
  render() {
    const { tabValue, dataSource, firstDate, secondDate } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <div className="allContent" style={{ margin: 20 }}>
          <div className="tabs">
            <Radio.Group
              options={options}
              onChange={this.onChangeTabValue}
              value={tabValue}
              optionType="button"
            />
          </div>
          <div className="fitlersAndExport">
            {tabValue === "month" && (
              <div className="datePicks">
                {" "}
                选择月份：
                <DatePicker
                  value={firstDate}
                  style={{ marginLeft: 5 }}
                  picker="month"
                  onChange={(e) => this.onFirstDatePickerChange(e)}
                  suffixIcon={
                    <>
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 20 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.75 1.875H16.2695C16.2695 0.839844 15.4297 0 14.3945 0H14.082C13.0469 0 12.207 0.839844 12.207 1.875H7.8125C7.8125 1.35742 7.60352 0.888672 7.26367 0.548828C6.92383 0.208984 6.45508 0 5.9375 0H5.625C4.58984 0 3.75 0.839844 3.75 1.875H1.25C0.560547 1.875 0 2.43359 0 3.125V17.5C0 18.1895 0.560547 18.75 1.25 18.75H18.75C19.4395 18.75 20 18.1895 20 17.5V3.125C20 2.43359 19.4395 1.875 18.75 1.875ZM13.457 2.03125C13.457 1.59961 13.8066 1.25 14.2383 1.25C14.6699 1.25 15.0195 1.59961 15.0195 2.03125V3.59375C15.0195 4.02539 14.6699 4.375 14.2383 4.375C14.0234 4.375 13.8281 4.28711 13.6855 4.14648C13.5449 4.00391 13.457 3.80859 13.457 3.59375V2.03125ZM5 2.03125C5 1.59961 5.34961 1.25 5.78125 1.25C6.21289 1.25 6.5625 1.59961 6.5625 2.03125V3.59375C6.5625 4.02539 6.21289 4.375 5.78125 4.375C5.56641 4.375 5.37109 4.28711 5.22852 4.14648C5.08789 4.00391 5 3.80859 5 3.59375V2.03125ZM18.75 16.875C18.75 17.2207 18.4707 17.5 18.125 17.5H1.875C1.5293 17.5 1.25 17.2207 1.25 16.875V8.125H18.75V16.875Z"
                          fill="white"
                        />
                        <path
                          d="M1.875 9.375H6.875V12.5H1.875V9.375ZM1.875 13.125H6.875V16.25H1.875V13.125ZM7.5 9.375H12.5V12.5H7.5V9.375ZM7.5 13.125H12.5V16.25H7.5V13.125ZM13.125 9.375H18.125V12.5H13.125V9.375ZM13.125 13.125H18.125V16.25H13.125V13.125Z"
                          fill="white"
                        />
                      </svg>
                    </>
                  }
                />{" "}
                <span style={{ margin: "0px 4px" }}>—</span>{" "}
                <DatePicker
                  value={secondDate}
                  picker="month"
                  onChange={(e) => this.onSecondDatePickerChange(e)}
                  suffixIcon={
                    <>
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 20 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.75 1.875H16.2695C16.2695 0.839844 15.4297 0 14.3945 0H14.082C13.0469 0 12.207 0.839844 12.207 1.875H7.8125C7.8125 1.35742 7.60352 0.888672 7.26367 0.548828C6.92383 0.208984 6.45508 0 5.9375 0H5.625C4.58984 0 3.75 0.839844 3.75 1.875H1.25C0.560547 1.875 0 2.43359 0 3.125V17.5C0 18.1895 0.560547 18.75 1.25 18.75H18.75C19.4395 18.75 20 18.1895 20 17.5V3.125C20 2.43359 19.4395 1.875 18.75 1.875ZM13.457 2.03125C13.457 1.59961 13.8066 1.25 14.2383 1.25C14.6699 1.25 15.0195 1.59961 15.0195 2.03125V3.59375C15.0195 4.02539 14.6699 4.375 14.2383 4.375C14.0234 4.375 13.8281 4.28711 13.6855 4.14648C13.5449 4.00391 13.457 3.80859 13.457 3.59375V2.03125ZM5 2.03125C5 1.59961 5.34961 1.25 5.78125 1.25C6.21289 1.25 6.5625 1.59961 6.5625 2.03125V3.59375C6.5625 4.02539 6.21289 4.375 5.78125 4.375C5.56641 4.375 5.37109 4.28711 5.22852 4.14648C5.08789 4.00391 5 3.80859 5 3.59375V2.03125ZM18.75 16.875C18.75 17.2207 18.4707 17.5 18.125 17.5H1.875C1.5293 17.5 1.25 17.2207 1.25 16.875V8.125H18.75V16.875Z"
                          fill="white"
                        />
                        <path
                          d="M1.875 9.375H6.875V12.5H1.875V9.375ZM1.875 13.125H6.875V16.25H1.875V13.125ZM7.5 9.375H12.5V12.5H7.5V9.375ZM7.5 13.125H12.5V16.25H7.5V13.125ZM13.125 9.375H18.125V12.5H13.125V9.375ZM13.125 13.125H18.125V16.25H13.125V13.125Z"
                          fill="white"
                        />
                      </svg>
                    </>
                  }
                />
              </div>
            )}

            <div className="exportButton">
              <Button
                // type="primary"
                className="exportButtons"
                style={{ borderRadius: 5 }}
                onClick={this.onExportClick}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.26318 0.828125H7.73687V9.1077C7.73687 9.3335 7.5895 9.48404 7.36845 9.48404H6.6316C6.41055 9.48404 6.26318 9.3335 6.26318 9.1077V0.828125V0.828125Z" />
                  <path d="M3.61045 4.89247L3.09466 4.36559C2.94729 4.21505 2.94729 3.98925 3.09466 3.83871L6.74203 0.112903C6.88939 -0.0376344 7.11045 -0.0376344 7.25782 0.112903L8.0315 0.903226L4.12624 4.89247C3.97887 5.04301 3.75782 5.04301 3.61045 4.89247V4.89247Z" />
                  <path d="M5.96842 0.903226L6.74211 0.112903C6.88947 -0.0376344 7.11053 -0.0376344 7.2579 0.112903L10.9053 3.83871C11.0526 3.98925 11.0526 4.21505 10.9053 4.36559L10.3895 4.89247C10.2421 5.04301 10.0211 5.04301 9.87368 4.89247L5.96842 0.903226ZM13.6316 6.84946H12.8947C12.6737 6.84946 12.5263 7 12.5263 7.22581V12.1183C12.5263 12.3441 12.3789 12.4946 12.1579 12.4946H1.84211C1.62105 12.4946 1.47368 12.3441 1.47368 12.1183V7.22581C1.47368 7 1.32632 6.84946 1.10526 6.84946H0.368421C0.147368 6.84946 0 7 0 7.22581V13.6237C0 13.8495 0.147368 14 0.368421 14H13.6316C13.8526 14 14 13.8495 14 13.6237V7.22581C14 7 13.8526 6.84946 13.6316 6.84946Z" />
                  <path d="M2.94734 8.35474H0.736816V6.84937H2.94734C3.1684 6.84937 3.31576 6.9999 3.31576 7.22571V7.9784C3.31576 8.16657 3.1684 8.35474 2.94734 8.35474V8.35474ZM13.2631 8.35474H11.0526C10.8316 8.35474 10.6842 8.2042 10.6842 7.9784V7.22571C10.6842 6.9999 10.8316 6.84937 11.0526 6.84937H13.2631V8.35474Z" />
                </svg>{" "}
                <span style={{ marginLeft: 5 }}></span>导出
              </Button>
            </div>
          </div>
          <div className="tableContent">
            <Table
              columns={tabValue === "month" ? monthColumns : yearColumns}
              dataSource={dataSource}
              bordered
              title={(data) => this.titleRenderer(data)}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}
