import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 下载模板
export const loadExportTemplate = (dataForm) => request.post("/excel/exportTemplate", dataForm, { responseType: "blob" });

// 导出模板
export const exportTemplate = (id, dataForm) => request.post(`excel/importExcelExt?param=${dataForm}`);
