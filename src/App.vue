<template>
  <div class="menu_list" :style="{ height: boxHeight + 'px' }">
    <div class="top_box">
      <div class="menu_title">{{ title }}</div>
      <div class="menu_more" :style="{ color: pinPaiColor }" @click="lineHerf()">更多</div>
    </div>
    <div ref="typeBox" class="type_box">
      <div ref="dragBox" class="drag_box" @mousedown="dragx($event)">
        <div v-for="(x, y) in menuTypeList" :key="y" class="type_title" :style="{ background: menuActive == y ? pinPaiColor : '#fff', color: menuActive == y ? '#fff' : '#6e6e6e' }" @click="typeBtn(x, y)">{{ x[menuTypeTitle] }}</div>
      </div>
    </div>
    <div class="list_box">
      <div class="for_box" v-for="(item, i) in menuList" :key="i">
        <el-tooltip class="item" effect="light" :content="item[menuDesc]" placement="bottom">
          <div class="menu_litm" :class="{ activeItem: active == i }" :style="{ borderWidth: active == i ? '2px' : '0px', borderStyle: 'solid', borderColor: pinPaiColor }" @click="setActive(i, item)">
            <!-- <img :src="item[imgSrc]" class="menu_img" alt="" /> -->
            <img :src="JSON.parse(item[imgSrc])[0].url" class="menu_img" alt="" />
            <div class="right_box">
              <span class="name" :style="{ color: active == i ? pinPaiColor : '#2a2b2d' }">{{ item[menuTitle] }}</span>
              <!-- <div class="desc">{{ item[menuDesc] }}</div> -->
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from './components/msgCompConfig'
import './index.css'
import { getAssetById } from './api/asset'
export default {
  name: 'App',
  props: {
    customConfig: Object,
    themeInfo: Object,
  },
  data() {
    return {
      title: '',
      assetId: '',
      menuId: '',
      active: 0,
      menuActive: 0,
      menuTitle: '',
      menuDesc: '',
      themeList: [],
      imgSrc: '',
      lineTo: '',
      menuTo: '',
      menuList: [],
      menuTypeList: [],
      menuTypeTitle: '',
      menuType: '',
      menuTypeVal: '',
      menuListAll: [],
      boxHeight: '',
    }
  },
  computed: {
    // title() {
    //   return this.customConfig?.title || "数据构建";
    // },
    pinPaiColor() {
      let { theme_global_config } = this.themeInfo || { theme_global_config: { '--theme-public-pinPai-color': 'rgba(24,144,255,1)' } }
      let themeColor = theme_global_config['--theme-public-pinPai-color']
      return themeColor
    },
  },
  mounted() {
    this.assetId = this.customConfig?.assetId
    this.menuId = this.customConfig?.menuId
    this.title = this.customConfig?.title
    this.menuTitle = this.customConfig?.menuTitle
    this.menuDesc = this.customConfig?.menuDesc
    this.themeList = JSON.parse(this.customConfig?.themePic)
    this.lineTo = this.customConfig?.moreTo
    this.menuTo = this.customConfig?.menuTo
    this.menuTypeTitle = this.customConfig?.menuTypeTitle
    this.menuType = this.customConfig?.menuType
    this.boxHeight = this.customConfig?.boxHeight
    this.getData()
    // this.$nextTick((x) => {
    //   window.addEventListener('keyup', this.handleKeyup)
    // })
    let { componentId } = this.customConfig || {}
    componentId && window.componentCenter?.register(componentId, 'comp', this, eventActionDefine)
  },
  methods: {
    async getData() {
      let { theme_id } = this.themeInfo
      this.imgSrc = ''
      this.themeList.forEach((y) => {
        if (y.themeId == theme_id) {
          this.imgSrc = y.image
        }
      })
      let { data } = await getAssetById(this.assetId)
      let key = data[0]
      let value = data[1]
      this.menuListAll = value.map((val) => {
        let obj = {}
        key.forEach((k, index) => {
          obj[k.col_name] = val[index]
        })
        return obj
      })
      this.getMenuData()
    },
    async getMenuData() {
      let { data } = await getAssetById(this.menuId)
      let key = data[0]
      let value = data[1]
      this.menuTypeList = value.map((val) => {
        let obj = {}
        key.forEach((k, index) => {
          obj[k.col_name] = val[index]
        })
        return obj
      })
    
      this.typeBtn(this.menuTypeList[0], 0)
    },
    dragx(el) {
      let oDiv = this.$refs.dragBox //当前元素
      let tDiv = this.$refs.typeBox //当前元素
      let disX = el.clientX
      let dWidth = tDiv.offsetWidth
      let sonWidth = oDiv.offsetWidth
      let out = sonWidth - dWidth
      let startLeft = 0
      if (oDiv.style.left == '') {
        startLeft = 0
      } else {
        startLeft = parseInt(oDiv.style.left)
      }
      console.log('startLeft', startLeft)
      document.onmousemove = function (e) {
        //通过事件委托，计算移动的距离
        let l = e.clientX - disX + startLeft
        if (Math.abs(l) < out) {
          //移动当前元素
          oDiv.style.left = l + 'px'
          // oDiv.style.top = t + 'px'
        }
      }
      document.onmouseup = function (e) {
        let endLeft = parseInt(oDiv.style.left)
        if (endLeft > 0) {
          oDiv.style.left = 0
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    lineHerf() {
      window.open(this.lineTo)
    },
    setActive(i, item) {
      this.active = i
      window.open(item[this.menuTo])
    },
    typeBtn(item, i) {
      // console.log('item', item)
      this.menuActive = i
      this.menuTypeVal = item[this.menuType]
      this.menuList = this.menuListAll.filter((x) => {
        return x[this.menuType] == this.menuTypeVal
      })
      console.log('this.menuList', this.menuList)
      // console.log('this.menuListAll', this.menuListAll)
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {}
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: 'app',
          event: '',
          payload: {
            value: '',
          },
        })
    },
    do_EventCenter_messageSuccess() {
      alert('动作执行成功！')
    },
    Event_Center_getName() {
      return ''
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId)
  },
}
</script>

<style lang="less" scoped>
// .menu_list::-webkit-scrollbar {
//   display: none;
// }
.menu_list {
  padding: 15px 0 15px 15px;
  width: calc(100% - 15px);
  background: #f1f2f7;
  border-radius: 4px;
  min-height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  .top_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .menu_title {
      font-size: 15px;
      color: #333;
      font-weight: 600;
    }
    .menu_more {
      margin-right: 15px;
      cursor: pointer;
      font-size: 13px;
    }
  }
  .type_box {
    position: relative;
    margin-top: 15px;
    margin-right: 15px;
    height: 30px;
    overflow: auto;
    overflow-y: hidden;
    display: flex;
    border-radius: 4px;
    &::-webkit-scrollbar {
      display: none;
    }
    .drag_box {
      position: absolute;
      left: 0px;
      display: flex;
      flex-wrap: nowrap;
      height: 30px;
      .type_title {
        cursor: pointer;
        display: inline-block;
        user-select: none;
        width: 100px;
        min-width: 100px;
        text-align: center;
        padding: 5px 0;
        font-size: 14px;
        border-right: 1px solid #e7e7e7;
      }
    }
  }
  .list_box {
    user-select: none;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    width: 100%;
    .for_box {
      width: calc(33.3% - 15px);
      margin-top: 10px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      cursor: pointer;

      .menu_litm {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // padding: 10px;
        background: #f7f8fc;
        border-radius: 4px;
        height: 110px;
        width: 100%;
        box-sizing: border-box;
        .menu_img {
          // margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .right_box {
          // height: 44px;
          // width: calc(100% - 80px);
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            font-size: 16px;
            font-weight: 600;
          }
          // .desc {
          //   font-size: 12px;
          //   width: 100%;
          //   overflow: hidden;
          //   text-overflow: ellipsis;
          //   white-space: nowrap;
          // }
        }
      }
      .activeItem {
        background: #ffffff;
      }
    }
  }
}
</style>