<template >
  <div class="wrap_login">
    <div class='shadowBgc'>
      <div class="login">
        <div class="appName distant-top">清夏笔记</div>
        <div class="title">{{isLogin?"登录":'新用户注册'}}</div>
        <div v-if="errTips.show" class="errTips">
          <i class="el-icon-warning"></i>
          <span class="errTipsSpan">{{errTips.info}}</span>
        </div>
        <el-form :model="form" size="mini">
          <el-form-item>
            <el-input
              ref="user"
              maxlength="22"
              autocomplete="off"
              prefix-icon="el-icon-user"
              class="input"
              v-model="form.user"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              ref="pwd"
              maxlength="18"
              autocomplete="off"
              :show-password="true"
              prefix-icon="el-icon-edit-outline"
              class="input"
              type="password"
              v-model="form.pwd"
              :placeholder="isLogin?'密码':'新密码'"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="!isLogin">
            <el-input
              ref="secondPwd"
              maxlength="18"
              autocomplete="off"
              :show-password="true"
              prefix-icon="el-icon-edit-outline"
              class="input"
              type="password"
              v-model="form.secondPwd"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
          <div class="tips">
            <span></span>
            <span @click="changeType" class="titleBtn">
              {{isLogin?'去注册':'去登录'}}
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>

          <el-form-item>
            <el-button
              class="btn"
              type="primary"
              :loading="loading"
              @click="onSubmit"
            >{{buttontext}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      form: {
        user: "",
        pwd: "",
        secondPwd: "",
      },
      loading: false,
      isLogin: true,
      errTips: {
        show: false,
        info: "",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    buttontext() {
      if (this.loading) {
        return this.isLogin ? "登录中..." : "注册中...";
      } else {
        return this.isLogin ? "登录" : "注册";
      }
    },
  },
  methods: {
    ...mapMutations(["updateUserInfo"]),
    changeType() {
      this.form = {
        user: "",
        pwd: "",
        secondPwd: "",
      };
      this.errTips = {
        show: false,
        info: "",
      };
      this.isLogin = !this.isLogin;
    },
    onSubmit(login) {
      console.log("this.isLogin", this.isLogin);
      if (this.reg()) {
        this.loading = true;

        let { user, pwd } = this.form;
        let url = "";
        if (login == "login") {
          url = api.login;
        } else {
          url = this.isLogin ? api.login : api.register;
        }
        console.log("url", url);
        let data = {
          name: user,
          pwd: this.$md5(pwd),
        };

        let param = new URLSearchParams();

        for (var k in data) {
          param.append(k, data[k]);
        }

        this.$axios({ method: "post", data: param, url })
          .then((res) => {
            this.loading = false;
            console.log("res", res);
            let { code, msg, data } = res.data;

            if (code != 1) {
              this.errTips = {
                show: true,
                info: msg || "服务器异常!",
              };
            } else {
              //清空数据
              //操作成功
              if (this.isLogin || login == "login") {
                this.form = {
                  user: "",
                  pwd: "",
                  secondPwd: "",
                };
                let userInfo = data;
                console.log("赋值的userinfo", userInfo);
                this.updateUserInfo({ userInfo });
                this.$router.push("/home");
              } else {
                this.onSubmit("login");
              }
            }
            console.log(res);
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    reg() {
      let { user, pwd, secondPwd } = this.form;
      let userReg = /^([a-zA-Z]|[0-9]|\_|\@|\.){6,22}$/;
      let pwdReg = /^[a-zA-z]|[0-9]{6,18}$/;

      if (!user) {
        this.errTips = {
          show: true,
          info: "请填写用户名",
        };
        this.$refs.user.focus();
        return false;
      }

      if (!userReg.test(user)) {
        this.errTips = {
          show: true,
          info: "用户名格式为6-22位数字字母组合,可包含._@三种特殊符号",
        };
        this.$refs.user.focus();
        return false;
      }

      if (!pwd) {
        this.errTips = {
          show: true,
          info: "请填写用户密码",
        };
        this.$refs.pwd.focus();
        return false;
      }

      if (!pwdReg.test(pwd)) {
        this.errTips = {
          show: true,
          info: "密码格式有误,为6-18位数字或字母组合",
        };
        this.$refs.pwd.focus();
        return false;
      }
      //如果是注册还需要校验这些
      if (!this.isLogin) {
        if (!secondPwd) {
          this.errTips = {
            show: true,
            info: "请填写确认密码",
          };
          return false;
        }
        if (pwd !== secondPwd) {
          this.errTips = {
            show: true,
            info: "两次密码输入不一致",
          };
          this.$refs.secondPwd.focus();
          return false;
        }
        if (!pwdReg.test(secondPwd)) {
          this.errTips = {
            show: true,
            info: "确认密码格式有误,为6-18位数字或字母组合",
          };
          this.$refs.secondPwd.focus();
          return false;
        }
      }
      console.log("form", this.form);
      return true;
    },
  },
};
</script>

<style scoped>
.wrap_login {
  background: #00ff00 url(../../static/images/home_bgc1.jpg) no-repeat fixed
    center;
  background-size: 100vw 100vh;
  flex: 1;
  height: 100vh;
}
.shadowBgc{
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
}
.login {
  width: 360px;
  min-height: 220px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  padding: 10px 30px;
  box-sizing: border-box;
}
.title {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
  position: relative;
}
.btn {
  width: 100%;
  background-color: rgb(93, 211, 93);
  border: none;
}
.tips {
  color: #fff;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 5px 10px 5px;
  cursor: pointer;
}
.tips span:hover {
  text-decoration: underline;
  color: rgb(93, 211, 93);
}
.errTips {
  margin-bottom: 5px;
  height: 20px;
  line-height: 20px;
  padding: 0 2px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  font-size: 9px;
  color: #fff;
}
.errTipsSpan {
  margin-left: 5px;
}
.input {
  /* background-color: red; */
}
.appName {
  position: absolute;
  text-align: center;
  font-size: 36px;
  /* color: #32cd32; */
  /* font-weight: 600; */
  top: -60px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
