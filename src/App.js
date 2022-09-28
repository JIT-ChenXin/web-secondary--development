import React, { useEffect, useState } from "react";
// 引入组件
import { Calendar, Timeline, Tooltip } from "antd";
// 引入图标
import { LeftOutlined, RightOutlined, DownOutlined, UpOutlined, PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
// 引入样式文件
import "./app.less";
// 引入接口文件
import { queryAssetById } from "./api/asset";
// 引入JQuery
import $ from "jquery";
// 引入antd国际化
import locale from "antd/lib/calendar/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const App = (props) => {
  // 日历是否展开
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  // 时间轴数据
  const [timelineData, setTimelineData] = useState([]);
  // 当日日期
  const [todayDate, setTodayDate] = useState(moment(new Date()).format("yyyy-MM-DD"));
  // 当日时间轴数据
  const [todayTimelineData, setTodayTimelineData] = useState([]);

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

  // 初始加载
  useEffect(() => {
    let assetID = props.customConfig["资产ID"];

    let queryForm = {
      column: props.customConfig["权限字段"],
      datatype: 0,
      type: 10,
      compareObj: window.currentUser.account_code,
    };

    queryAssetById(assetID, [queryForm]).then((res) => {
      let resData = translatePlatformDataToJsonArray(res);
      let dataList = JSON.parse(JSON.stringify(resData));
      let _todayData = [];
      dataList.forEach((item, index) => {
        let asstTime = Date.parse(new Date(item[props.customConfig["时间字段"]]));
        let _date = moment(asstTime).format("yyyy-MM-DD");
        if (_date === todayDate) {
          item[props.customConfig["时间字段"]] = moment(asstTime).format("HH:mm:ss");
          _todayData.push(item);
        }
      });
      setTodayTimelineData(_todayData);
      setTimelineData(resData);
    });
  }, [props.customConfig]); // eslint-disable-line

  // 开关日历
  useEffect(() => {
    if (calendarIsOpen) {
      let pickerTable = $(".ant-picker-cell-selected").parent().parent().children();
      let pickerToday = $(".ant-picker-cell-selected").parent();
      pickerToday.attr("class", "");
      pickerTable.each(function (index, element) {
        if ($(this).attr("style")) {
          $(this).removeAttr("style");
        }
      });
      $(".ant-picker-content").removeAttr("style");
    } else {
      let pickerTable = $(".ant-picker-cell-selected").parent().parent().children();
      let pickerToday = $(".ant-picker-cell-selected").parent();
      pickerToday.addClass("picker_today");
      pickerTable.each(function (index, element) {
        if (!$(this).attr("class")) {
          $(this).css("display", "none");
        }
      });
      $(".ant-picker-content").css("height", "auto");
      $(".ant-picker-content").css("z-index", "1");
      $(".ant-picker-content").css("background", "#ffffff");
    }
  }, [calendarIsOpen]);

  // 请求资产
  const getCalendarData = (date) => {
    let dataList = JSON.parse(JSON.stringify(timelineData));
    let _todayData = [];
    dataList.forEach((item, index) => {
      let asstTime = Date.parse(new Date(item[props.customConfig["时间字段"]]));
      let _date = moment(asstTime).format("yyyy-MM-DD");
      if (_date === date) {
        item[props.customConfig["时间字段"]] = moment(asstTime).format("HH:mm:ss");
        _todayData.push(item);
      }
    });
    setTodayTimelineData(_todayData);
  };

  // 关闭状态切换月份
  const changeCalendarMonth = () => {
    let pickerTable = $(".ant-picker-cell-selected").parent().parent().children();
    let pickerToday = $(".ant-picker-cell-selected").parent();
    pickerTable.each(function (index, element) {
      $(this).removeAttr("class");
    });
    pickerToday.addClass("picker_today");
    pickerTable.each(function (index, element) {
      if ($(this).attr("class")) {
        $(this).removeAttr("style");
      } else {
        $(this).css("display", "none");
      }
    });
  };

  // 切换日期
  const onDateChange = (value) => {
    getCalendarData(value.format("YYYY-MM-DD"));
    setTodayDate(value.format("YYYY-MM-DD"));
  };

  // 跳转地址
  const jumpUrl = () => {
    let url = props.customConfig["跳转地址"];
    window.open(url);
  };

  return (
    <div className="calender_timeline">
      {/* 日历 */}
      <Calendar
        locale={locale}
        fullscreen={false}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          return (
            <div>
              {/* 日历头部 */}
              <div className="calendar_header">
                <div className="calendar_title">{props.customConfig["标题"]}</div>
                <div className="calendar_date">
                  <div
                    onClick={() => {
                      const now = value.clone().month(value.month() - 1);
                      onChange(now);
                      setTimeout(() => {
                        if (!calendarIsOpen) {
                          changeCalendarMonth();
                        }
                      }, 100);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <LeftOutlined />
                  </div>
                  <div>{`${value.year()} 年 ${value.month() + 1} 月`}</div>
                  <div
                    onClick={() => {
                      const now = value.clone().month(value.month() + 1);
                      onChange(now);
                      setTimeout(() => {
                        if (!calendarIsOpen) {
                          changeCalendarMonth();
                        }
                      }, 100);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <RightOutlined />
                  </div>
                </div>
                <div
                  className="calendar_add"
                  onClick={() => {
                    jumpUrl();
                  }}
                >
                  <PlusOutlined />
                </div>
              </div>
            </div>
          );
        }}
        onChange={onDateChange}
      />
      <div className="open_calendar">
        {calendarIsOpen ? (
          <UpOutlined
            onClick={() => {
              setCalendarIsOpen(false);
            }}
          />
        ) : (
          <DownOutlined
            onClick={() => {
              setCalendarIsOpen(true);
            }}
          />
        )}
      </div>
      {/* 时间轴 */}
      {todayTimelineData.length ? (
        <Timeline mode="left" className="timeline">
          {todayTimelineData.map((item, index) => {
            return (
              <Timeline.Item label={item[props.customConfig["时间字段"]]} dot={<ClockCircleOutlined className="timeline-clock-icon" />} color="#D2D2D2" key={index}>
                <Tooltip placement="top" title={item[props.customConfig["任务字段"]]}>
                  {item[props.customConfig["任务字段"]]}
                </Tooltip>
              </Timeline.Item>
            );
          })}
        </Timeline>
      ) : (
        <div className="no_data">暂无数据</div>
      )}
    </div>
  );
};

export default App;
