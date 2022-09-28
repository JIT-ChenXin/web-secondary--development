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

  const [modelid, setModelid] = useState("");

  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = () => {
    setModelid(props?.allParams?.stateParams?.allConfigValues?.modelId);

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (isUpload) {
      props.handleSearch();
    }
    setIsModalOpen(false);
  };

  const handleOk = () => {
    if (isUpload) {
      props.handleSearch();
    }
    setIsModalOpen(false);
  };

  const loadProps = {
    accept: ".xlsx,.xls,.excel",
    action: `/sdata/rest/form/list/customize/importExcel?modelId=${modelid}&ywPoolTableAsset=${props.customParams.assetID_1}&ywUnitTableAsset=${props.customParams.assetID_2}`,
    name: "file",
    maxCount: 1,
    multiple: false,
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
