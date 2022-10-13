// 组件可派发事件
export const events = [
  {
    key: "change",
    name: "勾选数据",
    payload: [
      {
        name: "选中数据",
        key: "value",
        dataType: "objectArrary",
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
