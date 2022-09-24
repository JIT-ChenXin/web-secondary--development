import { useState, useEffect } from "react";
import { useSetState } from "ahooks";
import { queryCustomData } from "../../api/asset";

const useTreeData = ({ configuration }) => {
  const [list, setList] = useState([]);
  const [treeState, setTreeState] = useSetState({
    treeData: [],
    expandedKeys: [],
    selectedKeys: [],
  });

  useEffect(() => {
    initTreeData();
  }, [configuration.treeAssetId, list]);

  const initTreeData = async () => {
    const id = configuration.treeAssetId;

    const {
      treeTitle = "",
      treeDataId = "",
      treeParentId = "",
      treeMultLayer = false,
      treeFilter = true,
    } = configuration;

    if (id && id !== "") {
      try {
        const params = {
          queryCondition: {
            pageNum: 1,
            pageSize: 500,
            queryParams: list,
          },
          jsonObject: {
            assetId: id,
            flag: treeFilter,
          },
        };
        const { data = [] } = await queryCustomData(params);
        const treeData = data.map((item) => {
          return {
            key: item[treeDataId],
            title: item[treeTitle],
            parentId: item[treeParentId],
          };
        });
        setTreeState({
          treeData: treeMultLayer ? treeDataTranslate(treeData) : [...treeData],
          expandedKeys: [],
          selectedKeys: [],
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const treeDataTranslate = (data, id = "key", pid = "parentId") => {
    let res = [];
    let temp = {};
    for (let i = 0; i < data.length; i++) {
      temp[data[i][id]] = data[i];
    }
    for (let k = 0; k < data.length; k++) {
      if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
        if (!temp[data[k][pid]]["children"]) {
          temp[data[k][pid]]["children"] = [];
        }
        if (!temp[data[k][pid]]["_level"]) {
          temp[data[k][pid]]["_level"] = 1;
        }
        data[k]["_level"] = temp[data[k][pid]]._level + 1;
        temp[data[k][pid]]["children"].push(data[k]);
      } else {
        res.push(data[k]);
      }
    }
    return res;
  };
  const setTreeExpand = (expandedKeys) => {
    setTreeState({ expandedKeys });
  };
  const setTreeSelect = (selectedKeys) => {
    setTreeState({ selectedKeys });
  };
  return {
    treeState,
    setList,
    setTreeExpand,
    setTreeSelect,
  };
};
export default useTreeData;
