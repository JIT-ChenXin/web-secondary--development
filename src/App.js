import React, { useEffect, useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Upload, Table, Tabs, Modal } from "antd";

import { loadExportTemplate } from "./api/asset";

import Cookies from "js-cookie";

// 引入excel图标
import Excel from "./assets/excel.png";
// 引入样式文件
import "./app.less";

const List = (props) => {
  const { Dragger } = Upload;

  // 配置项JSON脚本
  const [jsonText, setJsonText] = useState("");

  // 是否展示预览
  const [isPreview, setIsPreview] = useState(false);
  // 是否展示对话框
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 文件名称
  const [fileName, setFileName] = useState("");
  // 文件页签名
  const [sheetName, setSheetName] = useState("");
  // 页签表格数据
  const [tabsItem, setTabsItem] = useState([]);
  // 页签表格列数据
  const [tabsClomItem, setTabsClomItem] = useState([]);

  // 上传成功文件数
  const [successNumber, setSuccessNumber] = useState(0);
  // 上传失败文件数
  const [errNumber, setErrNumber] = useState(0);

  useEffect(() => {
    let dataForm = props.customConfig["JSON脚本"];
    setJsonText(dataForm);
  }, []);

  const get_UUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(16);
    });
  };

  // 下载模板方法
  const AsciiToString = (asccode) => {
    return String.fromCharCode(asccode);
  };
  // 下载模板方法
  const UrlDecode = (zipStr) => {
    var uzipStr = "";
    for (var i = 0; i < zipStr.length; i += 1) {
      var chr = zipStr.charAt(i);
      if (chr === "+") {
        uzipStr += " ";
      } else if (chr === "%") {
        var asc = zipStr.substring(i + 1, i + 3);
        if (parseInt("0x" + asc) > 0x7f) {
          uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
          i += 8;
        } else {
          uzipStr += AsciiToString(parseInt("0x" + asc));
          i += 2;
        }
      } else {
        uzipStr += chr;
      }
    }
    return uzipStr;
  };
  // 下载模板
  const loadTemplate = () => {
    loadExportTemplate(jsonText)
      .then((res) => {
        const temp = res.headers["content-disposition"].split("=")[1]; // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
        let iconv = require("iconv-lite");
        iconv.skipDecodeWarning = true; //忽略警告
        let fileName = iconv.decode(temp, "utf-8");
        const _res = res.data;
        let blob = new Blob([_res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        let fileNameNew = UrlDecode(fileName);
        downloadElement.download = fileNameNew; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
      .catch((err) => {
        console.log("下载失败", err);
      });
  };

  // 重新导入
  const resetImport = () => {
    setFileName("");
    setIsPreview(false);
    message.warning("重新导入");
  };

  // 对话框确认
  const handleOk = () => {
    // 关闭对话框
    setIsModalOpen(false);
    if (tabsItem.length) {
      // 打开预览页
      setIsPreview(true);
    }
  };

  // 上传配置
  const importProps = {
    accept: ".xlsx,.xls,.excel",
    name: "file",
    maxCount: 1,
    multiple: false,
    action: `/sdata/rest/excel/importExcelExt?param=${jsonText}`,
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },

    // 上传之前
    beforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        message.warning("Excel文件最大不能超过200M");
        return false;
      }
    },

    // 触发上传
    onChange(info) {
      const { status, name, response } = info.file;

      if (status === "done") {
        message.success("上传成功");

        let resData = response.result;

        if (resData.errorList.length) {
          let columnList = [];
          let dataList = resData.errorList;

          let firstRow = {};
          resData.columnList.forEach((item, index) => {
            // 动态生成列
            columnList.push({
              title: resData.columnNameList[index],
              dataIndex: item,
              key: item,
              align: "center",
              fixed: "left",
              render: (_, record) => <>{record[record.errorColumn] == _ ? <span style={{ color: "red" }}>{_}</span> : <span>{_}</span>}</>,
            });
            // 第一行数据
            firstRow[item] = item;
          });

          dataList.unshift(firstRow);

          dataList.forEach((item) => {
            item.key = get_UUID();
          });

          setTabsItem(dataList);
          setTabsClomItem(columnList);

          // console.log(dataList);
          // console.log(columnList);
        }

        if (resData.errorList.length) {
          // 设置上传成功数
          setSuccessNumber(resData.success + resData.errorList.length - 1);
          // 设置上传失败数
          setErrNumber(resData.errorList.length - 1);
        } else {
          // 设置上传成功数
          setSuccessNumber(resData.success + resData.errorList.length);
          // 设置上传失败数
          setErrNumber(resData.errorList.length);
        }

        // 设置文件名
        setFileName(name);
        // 打开弹窗
        setIsModalOpen(true);
      } else if (status === "error") {
        message.error("上传失败");

        // let resData = {
        //   success: 3,
        //   errorList: [
        //     {
        //       birthday: "43863",
        //       address: "ä¸€æ ‹23",
        //       story_height: "ä¸€å±‚",
        //       name: "å°æŽ",
        //       id_card: "123",
        //       errorColumn: "birthday",
        //       family: "å°æŽçˆ¶äº²",
        //     },
        //   ],
        //   columnList: ["name", "id_card", "address", "story_height", "family", "birthday"],
        //   columnNameList: ["å§“å", "èº«ä»½è¯å·", "ä½å€", "å±‚é«˜", "çˆ¶æ¯åç§°", "ç”Ÿæ—¥"],
        // };

        // if (resData.errorList.length) {
        //   let columnList = [];
        //   let dataList = resData.errorList;

        //   let firstRow = {};
        //   resData.columnList.forEach((item, index) => {
        //     // 动态生成列
        //     columnList.push({
        //       title: resData.columnNameList[index],
        //       dataIndex: item,
        //       key: item,
        //       align: "center",
        //       fixed: "left",
        //       // render: (_, record) => <span style={record[record.errorColumn] == _ ? { color: "red" } : ""}>{_}</span>,
        //       render: (_, record) => <>{record[record.errorColumn] == _ ? <span style={{ color: "red" }}>{_}</span> : <span>{_}</span>}</>,
        //     });
        //     // 第一行数据
        //     firstRow[item] = item;
        //   });

        //   dataList.unshift(firstRow);

        //   dataList.forEach((item) => {
        //     item.key = get_UUID();
        //   });

        //   setTabsItem(dataList);
        //   setTabsClomItem(columnList);

        //   // console.log(dataList);
        //   // console.log(columnList);
        // }
      }
    },
  };

  return (
    <div className="import_content">
      {/* 按钮组 */}
      <div className="content_button">
        <Button
          type="primary"
          onClick={() => {
            loadTemplate();
          }}
        >
          模板下载
        </Button>
        <Button
          type="primary"
          onClick={() => {
            resetImport();
          }}
        >
          重新导入
        </Button>
      </div>
      {/* 拖拽上传 */}
      <Dragger {...importProps} showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p className="ant-upload-hint">仅支持Excel文件</p>
      </Dragger>
      {/* 预览*/}
      {isPreview && (
        <div>
          <div className="content_title">文件预览</div>
          <div className="import_preview">
            <div className="preview_title">
              <img src={Excel} alt="Excel" className="excel_img" />
              <div>{fileName}</div>
            </div>
            <Tabs
              type="card"
              items={[
                {
                  key: "1",
                  label: "Sheet1",
                  children: (
                    <Table
                      bordered
                      pagination={false}
                      columns={tabsClomItem}
                      dataSource={tabsItem}
                      scroll={{
                        x: 1000,
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
      {/* 对话框 */}
      <Modal className="import_content_modal" open={isModalOpen} onOk={handleOk} closable={false} okText={tabsItem.length ? "查看错误数据" : "确认"} keyboard={false} maskClosable={false}>
        <div className="modal_text">
          数据共导入{successNumber}条,其中存在{errNumber}条数据不合规
        </div>
      </Modal>
    </div>
  );
};

export default List;
