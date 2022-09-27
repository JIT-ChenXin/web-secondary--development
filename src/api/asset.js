import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
export const queryAssetById = (id) =>
  request.get("asset", { params: { asset_id: id } });

export const getDataWithSort = (id, dataForm) =>
  request.post(`form/queryAssetDataWithSort?asset_id=${id}`, dataForm)