const pro = false

let main = pro?'http://152.136.124.81:8081/':'http://127.0.0.1:8081/'


export default  {
    sendRecord:main+'record',//浏览网页的记录
    register:main+'register',//注册,
    login:main+'login',//登录,
    resetPwd:main+'resetPwd',//重置密码
    getDiary:main+'getDiary',//查询日记
    setDiary: main+'setDiary',//修改日记内容
    createDiary:main+'createDiary'//创建日记
}

