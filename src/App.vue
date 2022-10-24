<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" :ref="id" class="menuStoreBox">
    <div class="topMenu">
      <div class="menuTitle" :style="{color: theme.textColor}">常用应用</div>
      <div class="menuContent">
        <!-- <div class="nextPage"></div> -->
        <draggable class="menuDrag" handle=".mover" filter=".forbid" ghostClass="ghost" chosenClass="chosen" :scroll="true" v-model="cyMenuList" :forceFallback="false" group="people" animation="300" @start="onStart" @end="onEnd">
          <transition-group class="menuDragGroup">
            <div v-for="item,index in cyMenuList" :key="item.data_id" class="mover cyBox">
              <el-tooltip :key="item.desc ? item.desc : ''" effect="light" :content="item.name" placement="bottom">
                <div class="cyItem" :style="{borderColor: theme.themeColor }" @click.stop="lineTo(item)">
                  <img src="../pluginTemp/images/图片1.png" class="cyVector" alt="" @click.stop="cancelCy(item.data_id)">
                  <img :src="JSON.parse(item.photo)[0].url" class="menu_img" alt=""/>
                  <span class="menu_name">{{ item.name }}</span>
                </div>
              </el-tooltip>
              <div class="lineborders" v-if="cyMenuList.length - 1 != index"></div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <div class="centerInput">
      <div class="lineBorder"></div>
      <el-input v-model.trim="searchTxt" size="medium" placeholder="关键词" @change="searchBtn"></el-input>
      <div class="rightBtn" @click="searchBtn">
        <i class="el-icon-search"></i>&nbsp;&nbsp;搜索
      </div>
    </div>
    <div class="bottomBox">
      <!-- <div class="menuTitleBox">
        <div class="menuType" :class="{'activeMenuType': nowMenu === 'all'}" :style="{color: theme.textColor}" @click="menuType('all')">全部</div>
        <div class="menuType" v-for="item in MenuTypeList" :key="item.value" :class="{'activeMenuType': nowMenu === item.value}" :style="{color: theme.textColor}" @click="menuType(item.value)">{{item.value}}</div>
      </div> -->
      <el-tabs v-model="nowMenu" type="card" @tab-click="changeMenuType">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane v-for="item in MenuTypeList" :key="item.data_id" :label="item.menuTypeTitle" :name="item.menuType"></el-tab-pane>
      </el-tabs>
      <div class="menuContent">
        <div v-for="item, index in nowMenuList" :key="item.value" class="bottomCyBox">
          <el-tooltip class="dragGroupitem" effect="light" :content="item.desc ? item.desc : ''" placement="bottom">
            <div v-if="item.auth == true" class="bottomCyItem" :style="{borderColor: theme.themeColor }" @click="lineTo(item)">
              <img v-if="item.often == true" src="../pluginTemp/images/Vector.png" class="cyVector" alt="">
              <img v-if="item.often == false" src="../pluginTemp/images/star.png" class="cyVector" alt="" @click.stop="ptVectorHandel(item.data_id)">
              <img :src="JSON.parse(item.photo)[0].url" class="menu_img" alt="" />
              <span class="menu_name">{{ item.name }}</span>
            </div>
            <div v-if="item.auth == false" class="bottomCyItem" :style="{borderColor: theme.themeColor }">
              <div class="menu_img">
                <img v-if="item.no_access_photo" :src="JSON.parse(item.no_access_photo)[0].url" class="menu_imgIs" alt="" />
              </div>
              <span class="menu_name">{{ item.name }}</span>
            </div>
          </el-tooltip>
          <div v-if="nowMenuList.length - 1 != index || (index + 1) % 10 == 0" class="lineborder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  Tooltip,
  Input,
  Tabs,
  TabPane
} from "element-ui";
import Vue from "vue";
import utils from "@/utils";
import draggable from 'vuedraggable'
import { IMPLODED } from "adm-zip/util/constants";
import $ from "jquery";
import { getMenu, cancelMenuCy, refreshSorts, getMenuGroup, getAllMenu, setMenuCy } from "./api/asset";

import "./index.css"

Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "munu",
  components: {
    draggable,
  },
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      return {
        themeColor,
        textColor,
      };
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      styleEle: null,
      searchTxt: "",
      nowMenu: "all",
      allMenu: [], //  全部菜单
      nowMenuList: [], // 当先显示菜单
      cyMenuList: [], // 常用菜单
      MenuTypeList: [], // 菜单分类
    }
  },
  created() {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  mounted() {
    // 滚动轴【鼠标】横向滚动
    let tabsContainer = document.querySelector(".menuDrag");
    tabsContainer.addEventListener("wheel", (event) => {
      event.preventDefault();
      tabsContainer.scrollLeft += event.deltaY;
    });
    //用于注册事件定义，不可删除
    window.main = this
    let {componentId} = this.customConfig || {};
    componentId &&
    window.componentCenter?.register(
      componentId,
      "comp",
      this,
      eventActionDefine
    );
    let { id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    //用于定义接收用户输入
    this.$nextTick(() => {
      this.appendStyle()
    })
    this.getchangYong() // 常用菜单数据
    this.haveMenuGroup() // 获取菜单类型
    this.getAllMenuData('') // 获取全部菜单
  },
  methods: {
    // 常用数据
    async getchangYong() {
      this.cyMenuList = []
      let { data } = await getMenu()
      let {dataList,sorts} = data
      let sortList = sorts[0] ? JSON.parse(sorts[0].sorts) : []
      for (let index = 0; index < sortList.length; index++) {
        for (let current = 0; current < dataList.length; current++) {
          if (dataList[current].data_id == sortList[index]) {
            this.cyMenuList.push(dataList.splice(current,1)[0])
            current--
          }
        }
      }
      dataList.forEach(x=>{
        this.cyMenuList.push(x)
      })
      console.log('this.cyMenuList=',this.cyMenuList);
    },
    // 取消常用
    async cancelCy(id) {
      let res = await cancelMenuCy(id)
      console.log('取消常用',res);
      await this.getchangYong() // 常用菜单数据
      this.refreshSortsAgin() // 排序
      this.getAllMenuData('') // 获取全部菜单
    },
    // 刷新排序
    async refreshSortsAgin() {
      let sorts = this.cyMenuList.map(x=>{
        return x.data_id
      })
      // sorts = JSON.stringify(sorts)
      let res = await refreshSorts(sorts)
      console.log('刷新排序',res);
      this.getchangYong() // 常用菜单数据
    },
    // 菜单类型
    async haveMenuGroup() {
      let { data } = await getMenuGroup()
      this.MenuTypeList = data
      // console.log('this.MenuTypeList=',this.MenuTypeList);
    },
    // 所有菜单
    async getAllMenuData(words) {
      let { data } = await getAllMenu(words)
      let dataList = data.filter(x=>{
        return x.auth === false
      })
      this.allMenu = data.filter(x=>{
        return x.auth === true
      })
      this.allMenu = this.allMenu.concat(dataList)
      // console.log('this.allMenu',this.allMenu);
      this.changeMenuType({paneName: this.nowMenu})
    },
    // 设置常用
    async ptVectorHandel(id) {
      let res = await setMenuCy(id)
      console.log('设置常用',res);
      await this.getchangYong() // 常用菜单数据
      this.refreshSortsAgin() // 排序
      this.getAllMenuData('') // 获取全部菜单
    },
    appendStyle() {
      let style = `#${this.id} .cyItem:hover{color:${this.theme.themeColor};}#${this.id} .bottomCyItem:hover{color: ${this.theme.themeColor};}`;
      if (this.$refs[this.id]) {
        this.styleEle = document.createElement("style");
        document.head.appendChild(this.styleEle);
        this.styleEle.innerText = style;
      }
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let {componentId, appId} = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
      this.setValue(value)
    },
    // 跳转
    lineTo(item){
      let jumpWay = this.customConfig?.jumpWay ? this.customConfig.jumpWay : "0";
      if (jumpWay == "0") {
        window.open(item.url)
      } else {
        const customEvent = new CustomEvent('JUMP_APP_TAB', {
          detail: {
            key: "", // 导航管理里配置的menuId 如果想要实现已有menu切换 key=menuId+"#3"
            jumpUrl: item.url, // 跳转url 支持带host和不带host
            tabName: item.name, //页签名称
          },
        });
        document.dispatchEvent(customEvent);
      }
    },
    //开始拖拽事件
    onStart(){},
    //拖拽结束事件
    onEnd() {
      this.refreshSortsAgin()
    },
    // menu切换
    changeMenuType(item) {
      this.nowMenu = item.paneName;
      if (this.nowMenu === 'all') {
        this.nowMenuList = this.allMenu
      } else {
        this.nowMenuList = this.allMenu.filter(x=>{
          return x.menuType == this.nowMenu
        })
      }
    },
    // 查询
    searchBtn() {
      // if (this.searchTxt === "") return;
      this.getAllMenuData(this.searchTxt)
    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>

<style lang="less" scoped>
.menuStoreBox {
  user-select: none;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  padding: 24px;
  background: #F0F2F5;

  .topMenu {
    display: flex;
    flex-direction: column;
    flex: 1;
    .menuTitle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 112px;
      height: 40px;
      background: #FFFFFF;
      border-radius: 4px 4px 0px 0px;
    }
    .menuContent {
      width: 100%;
      height: 148px;
      background: #FFFFFF;
      border-radius: 0px 8px 8px 8px;
      .menuDrag {
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .menuDragGroup {
          width: 100%;
          height: 100%;
          display: flex;
          // justify-content: space-between;
          align-items: center;
          .cyBox {
            display: flex;
            padding: 16px 24px;
            padding-right: 0;
            align-items: center;
            .cyItem {
              position: relative;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100px;
              height: 100px;
              min-width: 100px;
              min-height: 100px;
              border-radius: 4px;
              box-sizing: border-box;
              color: #555555;
              &:hover {
                border-width: 1px;
                border-style: solid;
                box-shadow: 0px 5px 10px rgba(20, 75, 182, 0.12);
                .cyVector {
                  display: block;
                }
              }
              .cyVector {
                position: absolute;
                top: 8px;
                right: 10px;
                width: 13px;
                height: 13px;
                display: none;
              }
              .menu_img {
                user-select: none;
                margin-bottom: 8px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
              .menu_name {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                height: 20px;
                line-height: 20px;
              }
            }
            .lineborders {
              margin-left: 34px;
              height: 56px;
              border-right: 1px solid  rgba(0, 0, 0, 0.05);
            }
          }
        }
      }
      /*选中样式*/
      .chosen {
        .lineborders {
          opacity: 0;
        }
      }
      .ghost {
        opacity: 0;
      }
    }
  }
  .centerInput {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 16px;
    margin-bottom: 16px;
    width: 595px;
    height: 36px;
    .lineBorder {
      position: absolute;
      left: 15px;
      height: 12px;
      border: 1px solid #106EB2;
      z-index: 30;
    }
    /deep/.el-input__inner {
      border-radius: 36px 0px 0px 36px;
      color: #1E2940;
      text-indent: 7px;
      box-sizing: border-box;
      &::-webkit-input-placeholder {    /* Chrome/Opera/Safari */
        color: #1E2940;
      }
      &::-moz-placeholder { /* Firefox 19+ */
        color: #1E2940;
      }
      &:-ms-input-placeholder { /* IE 10+ */
        color: #1E2940;
      }
      &:-moz-placeholder { /* Firefox 18- */
        color: #1E2940;
      }
    }
    .rightBtn {
      font-family: 'PingFang SC';
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      min-width: 120px;
      height: 36px;
      line-height: 36px;
      background: #106EB2;
      border-radius: 0px 36px 36px 0px;
      color: #FFFFFF;
      font-size: 16px;
      &:active {
        box-shadow: 0 0 10px #106EB2;
      }
    }
  }
  .bottomBox {
    display: flex;
    flex-direction: column;
    flex: 1;
    .menuTitleBox {
      display: flex;
      flex: 1;
      .menuType {
        font-family: 'PingFang SC';
        text-align: center;
        color: #626973;
        font-weight: 400;
        font-size: 16px;
        padding: 8px 24px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8px 8px 0px 0px;
        white-space: nowrap;
      }
      .activeMenuType {
        font-family: 'PingFang TC';
        font-weight: 600;
        font-size: 16px;
        color: #106EB2 !important;
        background: rgba(255, 255, 255);
      }
    }
    /deep/.el-tabs{
      .el-tabs__header {
        border-bottom: none !important;
      }
      .el-tabs__header {
        margin: 0;
        .el-tabs__nav{
          border: none !important;
          .el-tabs__item {
            margin-right: 1px;
            font-family: 'PingFang SC';
            border: none !important;
            color: #626973;
            background: rgba(255, 255, 255, 0.4);
            font-size: 16px;
            border-radius: 8px 8px 0px 0px;
          }
          .is-active {
            font-family: 'PingFang TC';
            font-weight: 600;
            font-size: 16px;
            color: #106EB2 !important;
            background: rgba(255, 255, 255);
          }
        }
      }
    }
    .menuContent {
      padding: 24px;
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      background: #FFFFFF;
      .bottomCyBox {
        position: relative;
        display: flex;
        width: 10%;
        min-width: 154px;
        padding: 16px 0;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid  rgba(0, 0, 0, 0.05);
        .bottomCyItem {
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 100px;
          min-width: 100px;
          min-height: 100px;
          border-radius: 4px;
          box-sizing: border-box;
          color: #555555;
          &:hover {
            border-width: 1px;
            border-style: solid;
            box-shadow: 0px 5px 10px rgba(20, 75, 182, 0.12);
            .cyVector {
              display: block;
            }
          }
          .cyVector {
            position: absolute;
            top: 8px;
            right: 10px;
            width: 13px;
            height: 13px;
            display: none;
          }
          .menu_img {
            user-select: none;
            margin-bottom: 8px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;

            .menu_imgIs {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .menu_name {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
          }
        }
        .lineborder {
          position: absolute;
          right: 0;
          height: 56px;
          border-right: 1px solid  rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}
</style>
