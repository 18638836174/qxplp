<template>
  <div class="home">
    <div class="shadowBox">
      <!-- 音乐start -->
      <div false class="mp3">
        <div class="mp3Title">{{msg}}</div>
        <audio ref="music" muted loop="loop" controls="controls">
          <source src="../../static/audio/them1.mp3" type="audio/mpeg" />
        </audio>
      </div>
      <!-- 音乐end -->

      <!-- 日志列表start -->
      <div class="listBox" :style="{maxHeight:listBoxHeight+'px'}">
        <!-- 分页start -->
        <el-pagination
          background
          :small="true"
          :page-size="pageSize"
          :current-page="pageIndex+1"
          @size-change="sizeChange"
          @current-change="indexChange"
          :page-sizes="pageSizes"
          layout="total,prev, pager, next"
          :total="count"
          :hide-on-single-page= "true"
        ></el-pagination>
        <!-- 分页end -->

        <div v-for="(item,index) in list" :key="index" class="listItem">
          <div class="listTitle nowarp">{{item.createTime|formateTime('YYYY-MM-DD HH:mm:ss')}}</div>
          <div class="listContent nowarp">{{item.content}}</div>
        </div>
      </div>
      <!-- 日志列表end -->
      <img class="homeBgc" :src="'../../static/images/'+bgImg" />
      <!-- 提交框start -->
      <div v-show="true" class="submitBox">
        <el-form :model="form" size="mini">
          <el-input
            :clearable="true"
            resize="none"
            class="textarea"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="form.content"
          ></el-input>

          <div>
            <span class="btn right submitBtn" @click="onSubmit">提 交</span>
          </div>
        </el-form>
      </div>
      <!-- 提交框end -->
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import { mapState } from "vuex";
import { Notification } from "element-ui";

export default {
  name: "home",
  data() {
    return {
      msg: "清爽夏日",
      // bgImg:'home_bgc1.jpg',
      bgImg: "home_bgc1.jpg",
      form: {
        content: ""
      },
      list: [],
      listBoxHeight: document.documentElement.clientHeight - 150,
      pageSizes: [1, 2, 3, 5, 10],
      pageIndex: 0,
      count:0
    };
  },
  mounted() {
    console.log("this.userInfo", this.userInfo);
    this.setBgImg();
    this.palyMusic();
    this.sendRecord();
    this.getDiary();
  },
  computed: {
    ...mapState(["userInfo"]),
    pageSize(){
     let pageSize = parseInt((document.documentElement.clientHeight -200-150)/88)
      console.log('pageSize',pageSize)
      pageSize = pageSize>0?pageSize:5
      return pageSize
    }
  },
  methods: {
    indexChange(index) {
      this.pageIndex = index - 1;
      this.$nextTick(() => {
        this.getDiary();
      });
    },
    sizeChange(size) {
      this.pageSize = size;
      this.$nextTick(() => {
        this.getDiary();
      });
    },
    getSysInfo(fun) {
      var ua = window.navigator.userAgent;
      var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
      fun &&
        fun({
          isIphone,
          isAndroid,
          isMobile,
          ua
        });
    },
    setBgImg() {
      this.getSysInfo(({ isMobile }) => {
        if (isMobile) {
          this.bgImg = "home_bgc2.jpg";
        } else {
          this.bgImg = "home_bgc1.jpg";
        }
      });
    },
    palyMusic() {
      setTimeout(() => {
        this.$refs.music.play();
      }, 1000);
    },
    sendRecord() {
      console.log("api", api);
      let url = api.sendRecord;

      this.getSysInfo(params => {
        let { ua, isIphone, isAndroid, isMobile } = params;
        params = {
          ua,
          isIphone: isIphone ? 1 : 0,
          isAndroid: isAndroid ? 1 : 0,
          isMobile: isMobile ? 1 : 0
        };
        this.$axios.get(url, { params }).then(() => {
          console.log(111);
        });
      });
    },
    getDiary() {
      let { content } = this.form;
      let url = api.getDiary;

      let data = {
        token: this.userInfo.token,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };

      let param = new URLSearchParams();

      for (var k in data) {
        param.append(k, data[k]);
      }
      this.$axios({ method: "post", data: param, url })
        .then(res => {
          if (res.data.code == 1) {
            this.list = res.data.data.data;
            this.count = res.data.data.count;
          } else {
            Notification({
              message: res.data.msg,
              type: "error",
              position: "bottom-left"
            });
          }
          console.log("res.data", res.data);

          console.log("list", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      let { content } = this.form;

      if (!content.trim()) {
        Notification({
          message: "请输入有效内容",
          type: "warning",
          position: "bottom-left"
        });
        return;
      }
      let url = api.createDiary;

      let data = {
        content,
        token: this.userInfo.token
      };

      let param = new URLSearchParams();

      for (var k in data) {
        param.append(k, data[k]);
      }
      this.$axios({ method: "post", data: param, url })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.form.content = "";
            this.getDiary();
          } else {
            Notification({
              message: res.data.msg,
              type: "error",
              position: "bottom-left"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.home {
}
.shadowBox {
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.homeBgc {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}

.mp3 {
  position: fixed;
  left: 10px;
  top: 10px;
  background-color: transparent;
  border-radius: 5px;
  overflow: hidden;
  color: #fff;
  line-height: 20px;
  font-size: 14px;
}

.mp3Title {
  margin-left: 20px;
}

audio {
  background-color: transparent;
  margin-top: 7px;
  border: none;
}

.listBox {
  // padding: 10px;
  // background-color: rgba(255, 255, 255, 0.4);
  // margin-top: 100px;
  // height: 200px;
  width: 86vw;
  margin: 120px auto 0;
}
.listItem {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 10px 0;
  border-radius: 2px;
}

.listTitle {
  font-size: 14px;
  color: #565656;
  font-weight: 400;
}
.listContent {
  font-size: 14px;
  margin-top: 10px;

  text-decoration: underline;
  color: #323232;
  cursor: pointer;
}
.listContent:active {
  // color:#0f0
}
.submitBox {
  position: fixed;
  width: 86vw;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  // background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  height: 150px;
}
.btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.submitBtn {
  color: #fff;
  // background-color: #ffc800;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  margin-top: 5px;
  // border:1px solid #fff;
  // border-radius: 2px;
}
.submitBtn:active {
  position: relative;
  top: 1px;
  left: 1px;
}

.el-textarea__inner {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>