

import React, { useEffect, useState } from "react";
import WordOpenDetails from "../wordOpenDetails";
const List = ({
  allParams
}) => {
  console.log(allParams);
  const [stateObj, setStateObj] = useState(true);
  const { params, stateParams, propsParams } = allParams;
  const { buttonInfo = {}, record } = params;
  const { selectedRows, eventCenterInstance } = stateParams;
  const { id } = propsParams;
  useEffect(() => {
    setStateObj(true);
  }, [])
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
  return (
    <>{
      stateObj ? (<div>
        <WordOpenDetails
          setStateObj={setStateObj}
          response_detail={response_detail}
          modelId={id}
          dataId={dataId}
          logicExcute={logicExcute}
        />
      </div>) : (<div></div>)
    }
    </>
  );
};

List.propTypes = {


};

export default List;