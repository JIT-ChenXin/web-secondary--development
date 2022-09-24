import request from "./request";

export const getAssetJSONForProduct = (id) => request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = (id) => request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

export const getMoudleId = (dataForm) => request.post(`datapp/mapping/queryByMenu`, dataForm);

// [
//    { key: "name_of_park", label: "园区名称" },
//    { key: "instrument", label: "楼层" },
//    { key: "instrument_name", label: "楼栋" },
// ]

// [
//   { tag: "select", tagName: "园区名称", assetId: "7e8b005e-9e8a-4532-a161-a2418481fe82", showField: "name", saveField: "name_of_park" },
//   { tag: "number", tagName: "楼栋", assetId: "", showField: "", saveField: "instrument_name" },
//   { tag: "text", tagName: "楼层", assetId: "", showField: "", saveField: "instrument" },
// ]

// [
//   { componentId: "90c5e818-8888-4fc4-ad44-0073c65421b2", colIndex: 0, value: "90c5e818-8888-4fc4-ad44-0073c65421b2" },
//   { componentId: "8ccf8f09-219c-4342-aa7e-4c804ba71292", colIndex: 1, value: "8ccf8f09-219c-4342-aa7e-4c804ba71292" },
//   { componentId: "ba5dc4fb-255e-4022-a092-16a0e966b3de", colIndex: 2, value: "ba5dc4fb-255e-4022-a092-16a0e966b3de" },
//   { componentId: "71ea0d31-b69b-47e3-a19e-3d459b15efca", colIndex: 3, value: "71ea0d31-b69b-47e3-a19e-3d459b15efca" },
//   { componentId: "e6ec7ec2-0f11-4b81-a429-de928b3307c0", colIndex: 4, value: "e6ec7ec2-0f11-4b81-a429-de928b3307c0" },
//   { componentId: "56cb5b6b-2c41-47ff-a955-b32b342e8b14", colIndex: 5, value: "56cb5b6b-2c41-47ff-a955-b32b342e8b14" },
//   { componentId: "beca5cd0-9798-4ae7-b934-b4dfc22bea99", colIndex: 6, value: "beca5cd0-9798-4ae7-b934-b4dfc22bea99" },
//   { componentId: "d3aa8c93-668a-45bb-bb0f-90b51cda8569", colIndex: 7, value: "d3aa8c93-668a-45bb-bb0f-90b51cda8569" },
//   { componentId: "41537a31-9b05-4b72-a976-40061f6390ad", colIndex: 8, value: "41537a31-9b05-4b72-a976-40061f6390ad" },
//   { componentId: "9a5aa4b8-7c16-47f1-9062-cd8a5796de73", colIndex: 9, value: "9a5aa4b8-7c16-47f1-9062-cd8a5796de73" },
//   { componentId: "c5c040b5-da0c-4958-ba93-3e9802162877", colIndex: 10, value: "c5c040b5-da0c-4958-ba93-3e9802162877" },
//   { componentId: "91161e12-72ac-4de0-b44b-192e33f1f4fb", colIndex: 11, value: "91161e12-72ac-4de0-b44b-192e33f1f4fb" },
//   { componentId: "cd75daf1-2141-4c11-a874-b61d103e8e60", colIndex: 12, value: "cd75daf1-2141-4c11-a874-b61d103e8e60" },
//   { componentId: "7e9261a8-45e6-46d4-8fcf-788a1ba7ffea", colIndex: 13, value: "7e9261a8-45e6-46d4-8fcf-788a1ba7ffea" },
//   { componentId: "bc6b0b0c-e017-4922-9481-9d06923b1029", colIndex: 14, value: "bc6b0b0c-e017-4922-9481-9d06923b1029" },
//   { componentId: "fcfa6805-43d3-4518-86fe-6e917b0278aa", colIndex: 15, value: "fcfa6805-43d3-4518-86fe-6e917b0278aa" },
//   { componentId: "25e99554-0676-4b64-beef-102a43f9f7cb", colIndex: 16, value: "25e99554-0676-4b64-beef-102a43f9f7cb" },
// ];
