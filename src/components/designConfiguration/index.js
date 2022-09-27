import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, TreeSelect } from "antd";
import { queryAssetById, getDataWithSort, getAssets } from '../../api/asset.js';
import temp from './temp.json'
const { SHOW_PARENT } = TreeSelect;

const { TreeNode } = TreeSelect;
const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  // const [value, setValue] = useState(['0-0-0']);
  // const [fieldList, setFieldList] = useState([])
  const [treeData, settreeData] = useState([])

  const [AssetIdList, setAssetIdList] = useState([1])

  useEffect(() => {
    try {
      let config = JSON.parse(configuration)
      let promiseArr = []
      for (const key in config) {
        if (key.indexOf('assetId') != -1) {
          let i = key.split('assetId')[1]
          promiseArr[i] = queryAssetById(config[key])
          //  handleAssetById2(config[key], i)
        }
      }
      Promise.all(promiseArr).then(res => {
        let treeDataTemp = JSON.parse(JSON.stringify(treeData))
        res.forEach(x => {

          let temp = x.data
          let children = []
          temp.structures.forEach((x, i) => {
            children.push({ title: x.col_alias || x.col_name, key: x.id, value: x.id })
          })

          let treeDataItem = { title: temp.asset_name, value: temp.asset_id, key: temp.asset_id, children }
          treeDataTemp.push(treeDataItem)

        })
        settreeData(treeDataTemp)

      }).catch(err => {
        console.log(err);
      })//请求完毕处理


      if (JSON.parse(configuration).AssetIdList) setAssetIdList(JSON.parse(configuration).AssetIdList)

      form.setFieldsValue(JSON.parse(configuration));




    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    // allValues.fieldList2 = fieldList
    changeConfiguration(JSON.stringify(allValues));
  };
  // useEffect(() => {

  //   let formObj = form.getFieldsValue()

  //   onFormLayoutChange(null, formObj)

  // }, [form.getFieldValue()?.fieldList]);
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const onSelect = (value, node, extra) => {

    // let propNode = JSON.parse(JSON.stringify(node))
    // let fieldTemp = JSON.parse(JSON.stringify(fieldList))
    // fieldTemp.push({ assetid: propNode.asset_id, assetname: propNode.asset_name, column: propNode.title, id: propNode.value })
    // form.setFieldsValue({ fieldList: fieldTemp })
    // setFieldList(fieldTemp)
  }

  const onChange = (newValue, label, extra) => {
    // let id = extra.triggerValue
    // let fieldTemp = JSON.parse(JSON.stringify(fieldList))
    // if (!extra.checked) {
    //   let a = fieldTemp.findIndex(x => {
    //     return x.id == id
    //   })
    //   fieldTemp.splice(a, 1)
    // }
    // form.setFieldsValue({ fieldList: fieldTemp })
    // setFieldList(fieldTemp)
    // setValue(newValue);
  };
  const tProps = {
    onSelect,

    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };
  const handleAssetById = (asset_id, i) => {
    queryAssetById(asset_id).then(res => {
      let treeDataTemp = JSON.parse(JSON.stringify(treeData))
      let temp = res.data
      let children = []
      temp.structures.forEach((x, i) => {
        children.push({ title: x.col_alias || x.col_name, key: x.id, value: x.id })
      })

      let treeDataItem = { title: temp.asset_name, value: temp.asset_id, key: temp.asset_id, children }
      treeDataTemp[i] = treeDataItem
      settreeData(treeDataTemp)


    }).catch(err => {
      console.log(err);
    })
  }
  const handleAssetById2 = (asset_id) => {
    queryAssetById(asset_id).then(res => {
      let treeDataTemp = JSON.parse(JSON.stringify(treeData))
      let temp = res.data
      let children = []
      temp.structures.forEach((x, i) => {
        children.push({ title: x.col_name, key: x.id, value: x.id })
      })

      let treeDataItem = { title: temp.asset_name, value: temp.asset_id, key: temp.asset_id, children }
      treeDataTemp.push(treeDataItem)
      settreeData(treeDataTemp)


    }).catch(err => {
      console.log(err);
    })
  }
  const onBlurFn = (i, e) => {
    // console.log(i, e, '试一试')
    let asset_id = e.target.value
    // console.log(asset_id);
    handleAssetById(asset_id, i)
    //     let a = JSON.parse(JSON.stringify(form.getFieldsValue().AssetIdList))
    //     a[i]=asset_id
    // form.setFieldsValue({AssetIdList:a})
    // queryAssetById(asset_id).then(res => {
    //   let treeDataTemp = JSON.parse(JSON.stringify(treeData))
    //   let temp = res.data
    //   let children = []
    //   temp.structures.forEach((x, i) => {
    //     children.push({ title: x.col_name, key: x.id, value: x.id })
    //   })

    //   let treeDataItem = { title: temp.asset_name, value: temp.asset_id, key: temp.asset_id, children }
    //   treeDataTemp.push(treeDataItem)
    //   settreeData(treeDataTemp)
    //   form.setFieldsValue({ treeData: treeDataTemp })

    // }).catch(err => {
    //   console.log(err);
    // })
  }
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        item.disabled = true;
        return (
          <TreeNode key={item.key} title={item.title} value={item.value} disabled={item.disabled}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} key={item.key} title={item.title} value={item.value} />;
    });
  const newlyAddedFn = () => {
    let a = JSON.parse(JSON.stringify(AssetIdList))
    a.push(1)
    form.setFieldsValue({ AssetIdList: a })
    setAssetIdList(a)
  }
  return (
    <>

      <Form
        {...formItemLayout}
        layout="vertical"
        className="zhihui_form"
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Button onClick={newlyAddedFn} type="primary" >新增</Button>
        {
          AssetIdList.map((x, i) => {
            return (<Form.Item label={i + 1 + "资产id"} name={"assetId" + i}   >
              <Input onBlur={(e) => onBlurFn(i, e)} />
            </Form.Item>)
          })
        }


        <Form.Item label="字段名" name="fieldSet">
          <TreeSelect {...tProps} > {renderTreeNodes(treeData)}
          </TreeSelect>
        </Form.Item>

        <div style={{ display: 'none' }}>

          <Form.Item label="111" name="AssetIdList">
            <Input />
          </Form.Item>
        </div>

      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
