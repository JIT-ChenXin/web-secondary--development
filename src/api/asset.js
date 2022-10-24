import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取表格资产
export const queryAssetByTime = (ids, time) => request.post(`/DispersionRatio/queryDispersionRatio?ids=${ids}&time=${time}`);

// 获取图表资产
export const getEcharts = (ids, time) => request.get(`/DispersionRatio/queryColumnDiagramData?ids=${ids}&time=${time}`);

// 导出图表
export const exportEchartsExcel = (dataForm) => request.post(`/DispersionRatio/exportExcel`, dataForm, { responseType: "blob" });
