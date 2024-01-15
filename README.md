# 崩坏：星穹铁道角色模型展示
## 前言
1.  本站展示的所有3D模型和角色立绘版权均[为米哈游科技(上海)有限公司][URL1]所有, 本站仅提供展示!<br>
2. [《崩坏: 星穹铁道》同人衍生作品创作指引][URL2]<br>
3.  演示地址[https://sr.ycl.cool][URL3]<br>
## 主页面 -- index.html
此处可以根据需要查看的角色的属性和命途进行选择。<br>
所有表格独立为文件以方便后续更新。(表格文件使用html语法)<br>
&nbsp;&nbsp;pc.table     -- 主表格<br>
&nbsp;&nbsp;moble.table  -- 主表格续表(用于兼容手机)<br>
&nbsp;&nbsp;unknow.table -- 未分类模型<br>
![主页面](https://www.ycl.cool/blog/usr/uploads/2023/11/2659766377.png "主页面")
点击未分类模型会绕过picture.html直接跳转到3d.html并使用data2.json。<br>
data2.json示例:
```
"3": { // 人物编号
    "name": "三月七new", // 人物名称
    "from": "给你柠檬椰果养乐多你会跟我玩吗", // 模型来源
    "mmd": true,  // 是否可以进行mmd
    "weapons": 0  // 人物武器模型
},
```
## 立绘页面 -- picture.html
点击对应的角色名字以后即可进入立绘查看页面，此处可根据需要下载立绘。<br>
点击查看3D模型后会从data.json里读取模型相关信息并传递给3D页面。<br>
![立绘页面](https://www.ycl.cool/blog/usr/uploads/2023/11/4171367656.jpeg "立绘页面")
data.json示例:
```
"1": {  // 人物编号
    "name": "艾丝妲",  // 名称
    "data": "4,2",    // 表格位置
    "picurl": "/f/fb/t3l8ksl1j60xbi9zpfdhj8w2wb5hibh.png", // 立绘地址
    "urlroot": true,  // 立绘地址是否为 wiki.biligame.com
    "model": true,    // 是否有3D模型
    "weapons": 1      // 人物有几个武器模型
},
```
若网站带宽充足，可删除"urlroot"行并替换"picurl"为本地路径，同时请删除picture.js的一下代码。
```
// 判断立绘图片的所属域名前缀
if (result) {
    var picurl_root = "https://patchwiki.biligame.com/images/sr";
} else {
    var picurl_root = "https://upload-bbs.miyoushe.com/upload";
}
```
## 模型查看 -- 3d.html
点击查看将进入3D模型查看页面。(演示页面的模型在Github Page上所以可能会出现较长的加载时间)<br>
对应角色的武器会显示在角色周围。<br>
网页左侧会显示当前可以使用的模型动作文件，点击可以查看对应mmd动作.
![模型查看](https://www.ycl.cool/blog/usr/uploads/2023/12/1452640808.jpeg "模型查看")
进入页面会先行判断访问设备是否为webket内核若是则弹出提示框。
此处判断浏览器内核用的是https://github.com/mumuy/browser/
```
// 判断是否为Webkit用户
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (browser().engine == "webkit" || isSafari) {
  alert("!!!注意!!!\n由于Webkit内核对于WebGL兼容性有限,  页面可能出现未知渲染问题。\n若可能请更换非Webkit内核浏览器访问。")
}
```
当模型读取成功时控制台会输出详细信息。<br>
正常读取示例:
```ID:1 Name:艾丝妲 Weapons:1```<br>
带mmd动作读取示例:
```ID:1 Name:艾丝妲 ModelFrom:神帝宇 AnimationID:1 AnimationName:极乐净土 AnimationFrom:だんぶち```

[URL1]:https://www.mihoyo.com/
[URL2]:https://www.bilibili.com/read/cv23111427/
[URL3]:https://sr.ycl.cool/
