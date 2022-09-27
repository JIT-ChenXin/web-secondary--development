import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Tooltip, Form, Input } from "antd";
import { queryAssetById, getDataWithSort, getAssets } from '../../api/asset.js';
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import { getThemeStyle } from "../themeColor";
const { TextArea } = Input;

const style = {
  width: "100%", height: "100%", borderColor: 'transparent', backgroundColor: 'transparent'
}
const Child = ({
  data,
  onChange,
  formConfig,
  component,
  configuration: propsConfiguration,
  theme,
  child_id,
  index,
}) => {
  const state2 = useRef(data);
  const [form] = Form.useForm();
  const [echoData, setEchoData] = useState('')
  const [state, setState] = useState(data);
  const [formulaJson, setformulaJson] = useState([])
  const [SplicingL, setSplicingL] = useState('')
  const [block, setBlock] = useState(false)
  const [screenText, setScreenText] = useState('')
  const [configuration, setConfiguration] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldList, setFieldList] = useState([])
  const [coefficientN, setCoefficientN] = useState('')
  const defaultOptions = ['+', '-', '*', '/', '(', ')']
  const numberOptions = ['0', '1', '2', "3", '4', '5', '6', '7', '8', '9', '.', '.0']
  const defaultOptions2 = []
  const fieldOptions = [
    { assetid: '1', assetname: '产房', column: '面积' },
    { assetid: '1', assetname: '产房', column: '单价' },
    { assetid: '1', assetname: '产房', column: '公摊量111111' },
    { assetid: '1', assetname: '产房', column: '单价' },
    { assetid: '1', assetname: '产房', column: '金额' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
    { assetid: '1', assetname: '产房', column: '系数' },
  ]
  useEffect(() => {
    try {
      console.log(propsConfiguration);
      arrFieldFn()
      setConfiguration(JSON.parse(propsConfiguration));

    } catch (error) {
      console.error("configuration解析错误", error);
    }



  }, []);
  useEffect(() => {
    setScreenText(SplicingL)

  }, [SplicingL])
  const arrFieldFn = async () => {
    let propList = JSON.parse(propsConfiguration)
    let children = []
    for (const key in propList) {
      if (key.indexOf('assetId') != -1) {

        let res = await queryAssetById(propList[key])
        let temp = res.data
        temp?.structures?.forEach((x, i) => {
          children.push({ assetid: x.asset_id, assetname: temp.asset_name, column: x.col_alias || x.col_name, id: x.id })
        })
        // queryAssetById(propList[key]).then(res => {
        //   let temp = res.data
        //   temp.structures.forEach((x, i) => {
        //     children.push({ assetid: x.asset_id, assetname: temp.asset_name, column: x.col_name, id: x.id })
        //   })
        // }).catch(err => {
        //   console.log(err);
        // })
      }
    }
    let arrField = []
    propList?.fieldSet?.forEach((x, i) => {
      children.forEach((t, idx) => {
        if (x == t.id) arrField.push(t)
      })
    })
    arrField.forEach((x) => {
      arrField.forEach((t) => {
        if (x.column == t.column && x.id != t.id && !x.column2) {
          x.column2 = x.assetname + '--' + x.column
          t.column2 = t.assetname + '--' + t.column
        }
      })
    })
    if (arrField.length >= 6) {
      arrField.splice(5, 0, { column: '系数' })
    } else {
      arrField.push({ column: '系数' })
    }
    if (state) {

      let temp = JSON.parse(state)
      let Splicing = ''
      temp.forEach(x => {
        arrField.forEach(t => {
          if (x.column == t.column && x.assetid == t.assetid) {
            x.column = t.column
            x.column2 = t.column2

          }
        })
        Splicing += x.column2 || x.column || x.opeartion || x.coefficient
      })
      setformulaJson(temp)
      setSplicingL(Splicing)


    }
    setFieldList(arrField)
  }
  // useEffect(() => {
  //   setSplicingL(form.getFieldValue().text)

  // }, [form.getFieldValue().text])
  // const handleAssetById = (asset_id, i) => {
  //   queryAssetById(asset_id).then(res => {

  //     let temp = res.data

  //     temp.structures.forEach((x, i) => {
  //       children.push({ title: x.col_name, key: x.id, value: x.id })
  //     })

  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }
  const triggerEventCenter = async (targetValue) => {
    await window.eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: "change",
      payload: {
        value: targetValue,
        childIndex: index,
      },
    });
  };

  const do_EventCenter_getValue = function () {
    console.log(state2.current);
    return {
      value: state2.current,
    };
  };

  const do_EventCenter_setValue = function ({ value }) {
    setState(value);
    // state2.current = value;
  };

  const Event_Center_getName = () => {
    return `${formConfig?.form_name}-${component.columnStyle.title}`;
  };

  // 事件中心注册挂载
  useDelegator(
    component.id,
    { Event_Center_getName, do_EventCenter_getValue, do_EventCenter_setValue },
    eventActionDefine,
    formConfig?.id,
    child_id,
    index,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  );
  const openWin = () => {
    setIsModalOpen(true)
  };
  const handleOk = () => {
    setIsModalOpen(false);

    let TempformulaJson = JSON.parse(JSON.stringify(formulaJson))
    TempformulaJson.forEach(x => {
      if (x.id) {
        delete x.id
        delete x.column2
      }

    })
    setSplicingL(screenText)
    if (formulaJson.length != 0) {
      onChange(JSON.stringify(TempformulaJson))
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);

  };
  const fieldClick = (x) => {

    let tempArr = JSON.parse(JSON.stringify(formulaJson))
    // let a = form.getFieldValue().text || ''
    let a = screenText || ''
    a += x.column2 || x.column
    tempArr.push(x)
    setformulaJson(tempArr)
    setScreenText(a)
  }
  const defaultClick = (x) => {

    let tempArr = JSON.parse(JSON.stringify(formulaJson))
    tempArr.push({ opeartion: x })
    setformulaJson(tempArr)
    let a = screenText || ''
    a += x
    setScreenText(a)
    // form.setFieldsValue({ text: a })
  }
  const coefficientClick = (x) => {
    let tempB = block
    let tempArr = screenText || ''
    let tempArr2 = JSON.parse(JSON.stringify(formulaJson))

    tempB = !tempB
    if (tempB) {
      tempArr += '[]'
    } else {

      tempArr = tempArr.replace('[]', '')
      tempArr2.push({ coefficient: Number(coefficientN) })
      setCoefficientN('')
      setformulaJson(tempArr2)
    }

    setScreenText(tempArr)
    setBlock(tempB)
  }
  const numberClick = (x) => {
    let aa = coefficientN || ''

    let a = screenText || ''
    let i = a.lastIndexOf(']')
    a = a.slice(0, i) + x + a.slice(i)
    aa += x
    setCoefficientN(aa)
    setScreenText(a)
  }
  const emptyClick = () => {
    setScreenText('')

    setformulaJson([])
  }


  return (

    <><button style={style} onClick={openWin}  >{SplicingL || '请配置费项计费公式'}</button>
      <Modal forceRender title="配置区" open={isModalOpen} className='set_modal' centered={true} footer={null} onOk={handleOk} onCancel={handleCancel} width='640px' style={{ height: '500px' }}>
        <div className='screen_text' > <div className='screen_text' ></div> {screenText} </div>
        <div className='set_content'>
          <div className='set_sorll' >


            <div className="deaflutOptions" > {
              defaultOptions.map((x, i) => {
                return (<button key={i} onClick={() => { defaultClick(x) }} className="wisdomOptions"  ><div>{x}</div> </button>)
              })
            }

            </div>
            <div className='twoOptions' >
              <div className="fieldOptions" >
                {
                  fieldList?.length > 1 ? fieldList.map((x, i) => {
                    if (x.column == '系数') return (<Tooltip key={i} title={x.column} placement="bottom"><button onClick={() => { coefficientClick(x) }} disabled={false} className={`coefficientOptions ${block ? 'coeffHover' : null}`} >{x.column}</button></Tooltip>)
                    return (<Tooltip key={i} title={x.column2 || x.column} placement="bottom"><button onClick={() => { fieldClick(x) }} disabled={block} className={`${block ? 'wisdom' : 'wisdomOptions'}`}  >{x.column}</button></Tooltip>)
                  }) :
                    fieldOptions.map((x, i) => {
                      if (x.column == '系数') return (<Tooltip key={i} title={x.column} placement="bottom"><button onClick={() => { coefficientClick(x) }} disabled={false} className={`coefficientOptions ${block ? 'coeffHover' : null}`}  >{x.column}</button></Tooltip>)
                      return (<Tooltip key={i} title={x.column2 || x.column} placement="bottom"><button onClick={() => { fieldClick(x) }} disabled={block} className={`${block ? 'wisdom' : 'wisdomOptions'}`}   >{x.column}</button></Tooltip>)
                    })
                }
              </div>
              {/* <div className="deaflutOptions" > {
              defaultOptions2.map((x, i) => {
                return (<button key={i} onClick={() => { defaultClick(x) }} className="wisdomOptions"  ><div>{x}</div> </button>)
              })
            }

            </div> */}
              <div className="numberOptions" style={{ display: block ? 'block' : 'none' }} > {
                numberOptions.map((x, i) => {
                  return (<button key={i} onClick={() => { numberClick(x) }} className="wisdomOptions"  ><div>{x}</div> </button>)
                })
              }

              </div>

            </div>
          </div>
          <div className='set_footer' style={{ display: "flex" }}>
            <button onClick={emptyClick} className="wisdomOptions"  >   清除 </button>


            <Button key="back" type="primary" onClick={handleOk}>
              保存
            </Button>
          </div>

        </div>
      </Modal></>
  );
};

Child.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Child;
