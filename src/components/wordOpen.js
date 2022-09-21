/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2021-05-26 10:29:27
 * @LastEditTime: 2021-05-26 11:49:17
 * @FilePath: \onemind-web\src\data-reporting-new\application\list\custom_event_method\popup.js
 * @Description: 弹窗打开
 */
import React from 'react';
import WordOpenDetails from './wordOpenDetails';

const wordOpen = props => {
  const { params, setStateObj, stateParams, propsParams } = props.allParams;
  const { buttonInfo = {}, record } = params;
  const { selectedRows, eventCenterInstance } = stateParams;
  const { id } = propsParams;

  let response_detail = JSON.parse(buttonInfo.responseDetail || '{}');

  let dataId;
  if (record) {
    dataId = record.dataId;
  } else if (selectedRows && selectedRows.length) {
    let tempArr = [];
    selectedRows.map(item => {
      tempArr.push(item.dataId);
    });
    dataId = tempArr.join(',');
  }

  const logicExcute = async () => {
    const logicParams = {
      type: `${buttonInfo.id}-save`,
      payload: {},
      // backFunc: value => {},
    };
    const logicFlag = await eventCenterInstance.ishasProcess(logicParams);
    if (logicFlag) eventCenterInstance.logicExcute(logicParams);
  };

  const buttonModal = (
    <div>
      <WordOpenDetails
        setStateObj={setStateObj}
        response_detail={response_detail}
        modelId={id}
        dataId={dataId}
        logicExcute={logicExcute}
      />
    </div>
  );

  setStateObj({
    buttonModal,
  });
};

export default wordOpen;
