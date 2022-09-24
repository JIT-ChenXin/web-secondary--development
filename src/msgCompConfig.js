// 组件可派发事件
export const events = [
  {
    key: "batchEvents",
    name: "批量处理",
    type: "IEvent",
    payload: [
      {
        name: "内容",
        key: "startHour",
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
