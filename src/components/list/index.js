import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Modal } from "antd";

import { getMoudleId } from "../../api/asset";

import qs from "qs";

import Cookies from "js-cookie";

import "./index.less";

const List = (props) => {
  const { Dragger } = Upload;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [dataSource, setDataSource] = useState([]);

  const [modelid, setModelid] = useState("");

  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = () => {
    // let resDataList = [];

    // props.dataSource &&
    //   props.dataSource.forEach((item, index) => {
    //     if (item.length) {
    //       let obj = {};
    //       item.forEach((e, i) => {
    //         obj.componentId = e.componentId;
    //         obj.value = e.componentId;
    //         obj.sort = e.i;
    //       });
    //       resDataList.push(obj);
    //     }
    //   });

    // if (resDataList.length) {
    //   setDataSource(resDataList);
    // }

    let search = qs.parse(window.location.search);
    let menuId = "";

    if (search.menuId) {
      if (search.menuId.indexOf("#") != -1) {
        menuId = search.menuId.slice(0, search.menuId.indexOf("#"));
      } else {
        menuId = search.menuId;
      }
    }

    getMoudleId({ id: menuId, opt_type: "view" }).then((res) => {
      if (res.data.datapp_page_web_mappings.length) {
        setModelid(res.data.datapp_page_web_mappings[0].object_id);
      }
    });

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    if (isUpload) {
      window.location.reload();
    }
    setIsModalOpen(false);
  };

  const loadProps = {
    accept: ".xlsx,.xls,.excel",
    action: `/sdata/rest/form/list/customize/importExcel?modelId=${modelid}&ywPoolTableAsset=${props.customParams.assetID_1}&ywUnitTableAsset=${props.customParams.assetID_2}`,
    name: "file",
    maxCount: 1,
    multiple: false,
    // data: { importExcelParam: JSON.stringify(dataSource) },
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },

    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        message.success("上传成功");
        setIsUpload(true);
      } else if (status === "error") {
        message.error("上传失败");
      }
    },
  };

  return (
    <Modal title="导入文件" visible={isModalOpen} onCancel={handleCancel} onOk={handleOk} keyboard={false} maskClosable={false} okText="确认" cancelText="关闭">
      <Dragger {...loadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
      </Dragger>
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
