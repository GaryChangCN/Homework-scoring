## 作业上传+打分系统
---
#### 安装
> npm ci（需要 Node.js 20+）
#### 启动
> node app.js（默认监听端口 80，可用 PORT 修改）

> mongod --dbpath xxx（默认 mongodb://127.0.0.1:27017，数据库 score，可用 MONGODB_URI 和 MONGODB_DATABASE 修改）
#### 简介
##### 本项目采用 *javascript* + *node.js* + *mongodb* 开发完成。学生端采用了谷歌chrome应用商店配色以及我自己封装的 [_Ajax库](https://github.com/GaryChangCN/_Ajax) 。教师端使用了Jquery库和 **Flex** 布局,以及采用了百度*Echart*。后端使用了node.js采用mongodb作为数据库。
_Tips_ 支持多选、多次添加文件文件上传 
#### 界面预览

---
* 学生端
** 学生端上传作业，支持三种格式，可多选上传 ![预览](http://7xw4hd.com1.z0.glb.clouddn.com/1.png)
** 学生端预览+打分页面 ![预览](http://7xw4hd.com1.z0.glb.clouddn.com/2.png)
* 教师端
** 查看学生打分、评论、每组平均分、去除n个最大和n个最小后平均分、输入老师打分 ![预览](http://7xw4hd.com1.z0.glb.clouddn.com/3.png)
** 查看学生作业上传情况以及下载学生作业 ![预览](http://7xw4hd.com1.z0.glb.clouddn.com/4.png)
#### 依赖验证

运行 `npm test` 验证服务入口。设置 `MONGODB_TEST_URI` 指向本地测试 MongoDB，再执行同一命令可验证学生登录、查询和更新。测试创建并删除独立临时数据库，不使用真实数据。该历史项目不宜直接部署到公网；本次依赖更新不替代应用层安全审计。
