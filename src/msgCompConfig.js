// 组件可派发事件
export const events = [
  {
    key: "checkData",
    name: "勾选数据",
    type: "IEvent",
    payload: [
      {
        name: "选中数据",
        key: "selectRow",
        dataType: "objectArray",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [];

export default {
  actions,
  events,
};
