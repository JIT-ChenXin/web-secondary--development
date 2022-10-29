import React, { Component } from "react";
import { Button, Input, Layout, Menu, Anchor, message, Dropdown, Badge } from "antd";
import Setting from "./setting";
// import classNames from "classnames";
import qs from "querystringify";
import { stringify } from "./qs";
import ApplicationNotice from "./notice";
import history from "./history";
import {
  // PoweroffOutlined,
  BellOutlined,
  SettingOutlined,
  // LaptopOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { logout, getMenuData } from "./api/asset";
// import appService from "@njsdata/app-sdk";
import head from "./assets/head.webp";
import "./app.less";
const { Search } = Input;
// const { SubMenu } = Menu;
// const { Link } = Anchor;
const appid = qs.parse(window.location.search).appid;

const logoutSystem = () => {
  logout()
    .then((res) => {
      console.log("res", res);
      if (res.status === 200) {
        if (res.data) {
          console.log("res.data", res.data);
          let href = `/application/login/${appid}`;
          window.location.href = href;
        } else {
          console.log("Nores.data");
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: "默认主题",
      },
      {
        key: "2",
        label: "蓝绿主题",
      },
      {
        key: "3",
        label: "蓝灰主题",
      },
      {
        key: "4",
        label: "香槟金主题",
      },
    ]}
  />
);
const menu2 = (
  <Menu
    items={[
      // {
      //   key: "1",
      //   label: (
      //     <span
      //       onClick={() => {
      //         window.history.push(
      //           `/applicationview/personalcenter?appid=${
      //             qs.parse(window.location.search).appid
      //           }&type=view&menuId=${qs.parse(window.location.search).menuId}${
      //             qs.parse(window.location.search).pId
      //               ? "&pId=" + qs.parse(window.location.search).pId
      //               : ""
      //           }`
      //         );
      //         window.location.reload();
      //       }}
      //     >
      //       个人中心
      //     </span>
      //   ),
      // },
      {
        key: "2",
        label: <span onClick={logoutSystem}>退出登录</span>,
      },
    ]}
  />
);
// const menu3 = <ApplicationNotice styleStore={{}} />;
/*!TODO:1.菜单接口；2.站内信接口；3.主题改变方法 ；4.用户信息；*/
export default class App extends Component {
  async componentDidMount() {
    const { customConfig } = this.props;
    const {
      // appId = "72136134-f4a1-47b6-8f9c-e3871a092456",
      // menuId = "ce5261f2-fdea-4a1b-b805-26ba686ab467",
      buttons = [],
    } = customConfig || {};
    // const { data } = await getMenuData(appId, menuId);
    // let buttons = data?.menuAndButton?.datappMenus;
    // let menuid = qs.parse(window.location.search)?.menuId;
    // console.log("menuId: ", menuid);
    this.setState({
      buttons,
      selectButton: buttons?.[0]?.name || "",
    });
    const events = [];
    const actions = [];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }
  state = {
    selectButton: "",
    buttons: [],
  };
  // onMenuButtonClick = (e) => {
  //   this.setState({ selectButton: e });
  // };
  onSearch = (value) => {
    const { customConfig } = this.props;
    const { searchUrl = "" } = customConfig || {};
    let a = searchUrl;
    let b = a + value;
    window.open(b);
  };
  onGongzuotaiClick = () => {
    const { customConfig } = this.props;
    const { workbenchUrl = "" } = customConfig || {};
    window.open(workbenchUrl);
  };
  /*
   * url 目标url
   * arg 需要替换的参数名称
   * arg_val 替换后的参数的值
   * return url 参数替换后的url
   */
  // changeURLArg = (url, arg, arg_val) => {
  //   var pattern = arg + "=([^&]*)";
  //   var replaceText = arg + "=" + arg_val;
  //   if (url.match(pattern)) {
  //     var tmp = "/(" + arg + "=)([^&]*)/gi";
  //     tmp = url.replace(eval(tmp), replaceText);
  //     window.open(tmp, "_self");
  //     return;
  //   } else {
  //     if (url.match("[?]")) {
  //       console.log('url + "&" + replaceText: ', url + "&" + replaceText);
  //       window.open(url + "&" + replaceText, "_self");
  //       return;
  //     } else {
  //       window.open(url + "?" + replaceText, "_self");
  //       console.log('url + "?" + replaceText: ', url + "?" + replaceText);
  //       return;
  //     }
  //   }
  //   // window.open(url + "\n" + arg + "\n" + arg_val, "_self");
  // };
  // loop = (data, flag) =>
  //   data.map((item) => {
  //     if (item.children && item.children.length > 0 && item.isDelete !== 0) {
  //       return (
  //         <SubMenu
  //           key={(item.type === 1 ? "system" : item.id) + "#" + item.type}
  //           className={classNames({
  //             marginleft: item.level > 3,
  //             aaaa: true,
  //             "head-menu": true,
  //             "ant-menu-submenu-selected":
  //               this.props.selectKey ===
  //               (item.type === 1 ? "system" : item.id) + "#" + item.type,
  //           })}
  //           popupClassName={"app-header-submenu "}
  //           popupOffset={flag ? [-24, 12] : [18, -8]}
  //           title={
  //             <span
  //               className="menuTitle"
  //               onClick={() =>
  //                 this.props.onClickMenu({
  //                   key:
  //                     (item.type === 1 ? "system" : item.id) + "#" + item.type,
  //                   isSubMenu: true,
  //                 })
  //               }
  //             >
  //               <span className={this.props.collapsed ? "no-scroll" : "scroll"}>
  //                 {item.icon ? this.handleIcon(item) : null}
  //                 <span className="name" title={item.name}>
  //                   {item.name}
  //                 </span>
  //               </span>
  //               <div />
  //             </span>
  //           }
  //         >
  //           {this.loop(item.children, false)}
  //         </SubMenu>
  //       );
  //     } else if (
  //       (!item.children || item.children.length === 0) &&
  //       item.isDelete !== 0
  //     ) {
  //       const keys = (item.type === 1 ? "system" : item.id) + "#" + item.type;
  //       return (
  //         <Menu.Item
  //           key={keys}
  //           className={classNames({
  //             marginleft: true,
  //             menuTitle: true,
  //             "head-menu": true,
  //           })}
  //           style={{ display: "flex", alignItems: "center" }}
  //         >
  //           {item.mapping_id && this.props.type === "view" ? (
  //             <Anchor
  //               affix={false}
  //               getContainer={() =>
  //                 document.getElementById("application-content-route")
  //               }
  //             >
  //               <Link
  //                 href={`#${item.mapping_id}`}
  //                 title={
  //                   <span
  //                     className={this.props.collapsed ? "no-scroll" : "scroll"}
  //                   >
  //                     {item.icon ? this.handleIcon(item) : null}
  //                     <span className="name" title={item.name}>
  //                       {item.name}
  //                     </span>
  //                   </span>
  //                 }
  //               />
  //             </Anchor>
  //           ) : (
  //             <span className={this.props.collapsed ? "no-scroll" : "scroll"}>
  //               {item.icon ? this.handleIcon(item) : null}
  //               <span className="name" title={item.name}>
  //                 {item.name}
  //               </span>
  //             </span>
  //           )}
  //           <div />
  //         </Menu.Item>
  //       );
  //     }
  //   });
  // handleMenu = (data) => {
  //   if (data && this.props.type !== "view") {
  //     return data.filter((item) => item.type !== 1);
  //   }
  //   return data;
  // };
  onClickMenu = async ({ key, isSubMenu }) => {
    let menuAnchor = "";
    if (key?.split("#")[0]) {
      let menu = this.state.buttons.find((el) => el.id === key.split("#")[0]);
      menuAnchor = menu?.mapping_id;
    }

    if (key.split("#")[1] === "2" || key.split("#")[1] === "4") {
      if (!isSubMenu && key.split("#")[1] !== "4") {
        message.info("该菜单没有绑定页面！");
      }
      return false;
    }
    this.setState({ selectButton: key });

    this.goSearch(
      { ...qs.parse(window.location.search), menuId: key },
      menuAnchor
    );
  };
  goSearch(query, menuAnchor) {
    if (query.breadcrumb) {
      delete query.breadcrumb;
    }
    if (query.pId) {
      delete query.pId;
    }
    console.log("window.history: ", window.history);

    history.push({
      pathname: "/applicationview/content/view",
      search: stringify({
        ...query,
      }),
    });
    // {intl.get('APP.JTA')}
    if (menuAnchor) {
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        document.getElementById(menuAnchor)?.scrollIntoView(true);
      }, 3000);
    }
  }
  onMenuButtonClick = (item, index) => {
    // if (item.name === "SYSR.APP_MANAGEMENT") {
    //   this.onClickMenu({ key: "system#" + item.type, isSubMenu: false });
    // } else {
    //   this.onClickMenu({ key: item.id, isSubMenu: false });

    // }
    let params = []
    let url = item.url
    if (item.params.length > 0) {
      item.params.forEach(x => {
        let item = x.key + '=' + x.value
        params.push(item)
      })
      params = params.join('&')
      url = url + '?' + params
    }

    if (index > 0) {
      this.setState({ selectButton: item.name }, () => window.open(url));
    } else {
      this.setState({ selectButton: item.name }, window.location.reload());
    }
  };
  render() {
    const { customConfig } = this.props;
    const {
      logoUrl,
      title,
      mainHeight,
      //头部背景图片
      headerImageUrl,
      // 菜单高度
      selectHeight,
      //被选中菜单文字颜色
      selectTextColor = "#ffffff",
      // 选中背景颜色
      selectBackgroundColor = "#313a52",
      // 正常地址颜色
      menuTextColor = "rgba(0, 0, 0, 0.85)",
      // 搜索框地址
      // searchUrl = "",
      // 工作台地址
      // workbenchUrl = "",
      buttons = [],
      msgLink = ""
    } = customConfig || {};

    const { selectButton } = this.state;
    if (this.props.isConfig) {
      return <Setting {...this.props} />;
    }
    return (
      <div
        className="herder"
        style={
          headerImageUrl?.length > 0
            ? {
              background: `url(${headerImageUrl})`,
              backgroundSize: "cover",
            }
            : { background: `url(${head})`, backgroundSize: "cover" }
        }
      >
        <div
          className="mainTop"
          style={{ height: mainHeight ? mainHeight : "64px", color: "#ffffff" }}
        >
          <div className="leftInfo">
            <img
              alt="logo"
              src={logoUrl}
              style={{ display: logoUrl ? "block" : "none" }}
              className="logo"
            />
            <img
              alt="logo2"
              src={require("./assets/logo.png").default}
              style={{ display: logoUrl ? "none" : "block" }}
              className="logo"
            />
            <div className="title">{title ? title : "监管受理子系统"}</div>
          </div>

          <div className="lineRight">
            <Search
              placeholder="请输入关键词"
              onSearch={this.onSearch}
              style={{ borderRadius: "15px 0px 0px 15px", color: "#ffffff" }}
            />
            <ApplicationNotice msgLink={msgLink} styleStore={{}}>
              <BellOutlined
                className="BellOutlined"
                style={{
                  margin: "0px 5px 0px 10px",
                }}
              />
            </ApplicationNotice>
            <Dropdown overlay={menu}>
              <SettingOutlined
                style={{ margin: "0px 15px 0px 10px" }}
                className="setting"
              />
            </Dropdown>

            {/* <Button
              icon={<LaptopOutlined />}
              className="gongzuotai"
              onClick={this.onGongzuotaiClick}
            >
              工作台
            </Button> */}
            <div className="user_info">
              <img
                alt="touxiang"
                src={window?.currentUser?.photo || ""}
                style={{ marginRight: "10px ", width: 24, borderRadius: 15 }}
                onClick={this.onGongzuotaiClick}
              />
              <span
                className="user_name"
                style={{ minWidth: 50, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.name || "默认"}
              </span>
              <span
                className="shenfen"
                style={{ minWidth: 40, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.userName || "默认"}
              </span>

              <Dropdown overlay={menu2}>
                <span
                  className="zuzhi"
                  style={{
                    minWidth: 40,
                    marginRight: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  {window?.currentUser?.office_name || "默认"}
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div>
        </div>
        <div
          className="secondLine"
          style={{ height: selectHeight ? selectHeight : "64px" }}
        >
          <div className="allButtons">
            {buttons.map((item, index) => {
              return (
                <Button
                  className={
                    selectButton === item.name ? "selectButton" : "menubuttons"
                  }
                  style={
                    selectButton === item.name
                      ? {
                        color: selectTextColor,
                        background: selectBackgroundColor,
                      }
                      : { color: menuTextColor }
                  }
                  onClick={() => {
                    // this.changeURLArg(window.location.href, "menuId", item.id)
                    this.onMenuButtonClick(item, index);
                  }}
                >
                  {item.name === "SYSR.APP_MANAGEMENT" ? "应用管理" : item.name}
                </Button>
              );
            })}
          </div>
          {/* <div className="lineRight">
            <Search
              placeholder="请输入关键词"
              onSearch={this.onSearch}
              style={{ borderRadius: "15px 0px 0px 15px" }}
            />
            <Dropdown overlay={menu3}>
              <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
            </Dropdown>
            <ApplicationNotice styleStore={{}}>
              <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
            </ApplicationNotice>
            <Dropdown overlay={menu}>
              <SettingOutlined
                style={{ margin: "0px 15px 0px 10px" }}
                className="setting"
              />
            </Dropdown>

            <Button
              icon={<LaptopOutlined />}
              className="gongzuotai"
              onClick={this.onGongzuotaiClick}
            >
              工作台
            </Button>
            <div className="user_info">
              <img
                alt="touxiang"
                src={window?.currentUser?.photo}
                style={{ marginRight: "10px ", width: 24 }}
              />
              <span
                className="user_name"
                style={{ minWidth: 50, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.name || "默认"}
              </span>
              <span
                className="shenfen"
                style={{ minWidth: 40, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.userName || "默认"}
              </span>

              <Dropdown overlay={menu2}>
                <span
                  className="zuzhi"
                  style={{
                    minWidth: 40,
                    marginRight: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  {window?.currentUser?.office_name || "默认"}
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
