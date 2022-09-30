import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
export const queryAssetByIds = id =>
  request.post(`/form/getAssetData?asset_id=${id}`, []);

/**
* 常用资产查询
*/
export const getMenu = () =>
  request.get(`/28s/datapp/queryUseMenusByUserId`);

/**
* 取消常用
* @param id 资产ID
*/
export const cancelMenuCy = id =>
  request.get(`/28s/datapp/deleteOftenMenu?dataId=${id}`);

/**
* 设置常用
* @param id 资产ID
*/
export const setMenuCy = id =>
  request.get(`/28s/datapp/saveOftenMenu?dataId=${id}`);

/**
* 排序
* @param sorts 资产顺序
*/
export const refreshSorts = sorts =>
  request.post(`/28s/datapp/updateMenuSort`, {sorts});

/**
* 查询菜单分组
*/
export const getMenuGroup = () =>
  request.get(`/28s/datapp/queryMenuGroup`);

/**
* 查询菜单分组
* @param keyWord 关键词
*/
export const getAllMenu = (keyWord) =>
  request.get(`/28s/datapp/queryAllMenu?keyWord=${keyWord}`);