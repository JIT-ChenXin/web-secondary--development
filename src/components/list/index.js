import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { message, notification } from "antd";

import { getUrlId } from "../../api/asset";

import dd from "gdt-jsapi";

import qs from "querystringify";

import "./index.less";

const openNotification = (title, message) => {
  notification.open({
    message: title,
    description: message,
    duration: null,
  });
};

const List = (props) => {
  useEffect(() => {
    handleClick();
  }, []);

  // 对话框确认
  const handleClick = () => {
    // 解析Url上的地址
    let _url = qs.parse(window.location.search);
    if (_url[props.customParams.params]) {
      setTimeout(() => {
        dd.scan({ type: "qr" })
          .then((result) => {
            // 判断扫码返回参数是不是正确地址
            if (typeof result.text === "string") {
              let _codeStr = result.text;
              // 符合详情页地址
              if (_codeStr.indexOf("dataId") != -1) {
                let urlObj = getQueryObject(result.text);
                // 接口参数
                let dataForm = {
                  taskId: _url[props.customParams.params] || "",
                  dataId: urlObj.dataId,
                  assetId: props.customParams.assetId || "",
                };
                // 获取正确跳转地址
                getUrlId(dataForm)
                  .then((res) => {
                    // openNotification("接口正确参数", JSON.stringify(res));
                    if (res.data == 1) {
                      message.success("资产已完成盘点");
                    } else if (res.data == 2) {
                      message.success("资产已完成盘点，不用再次盘点");
                    } else if (res.data == 3) {
                      message.success("该资产已申报异常，不用再次盘点");
                    } else if (res.data == 4) {
                      message.success("不是您需要盘点的资产");
                    }
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  })
                  .catch((err) => {
                    // openNotification("接口错误参数", JSON.stringify(err));
                    message.error(err.data.message);
                  });
              } else {
                return message.error("未获取到dataId");
              }
            }
          })
          .catch((err) => {
            message.error(err);
          });
      }, 300);
    } else {
      return message.error("未获取到正确地址");
    }
  };

  // 解析URL
  const getQueryObject = (url) => {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf("?") + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1);
      let val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return rs;
    });
    return obj;
  };

  return <></>;
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
