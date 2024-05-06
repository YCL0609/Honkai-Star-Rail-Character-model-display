# 崩坏：星穹铁道角色模型展示
## 前言
1.  本站展示的所有3D模型和角色立绘版权均[为米哈游科技(上海)有限公司][URL1]所有, 本站仅提供展示!<br>
2. [《崩坏: 星穹铁道》同人衍生作品创作指引][URL2]<br>
3. 演示地址[https://sr.ycl.cool][URL3]<br>
## outsite目录
目录内为引用的其他网站js文件副本。<br>
&nbsp;&nbsp;&nbsp;function.js — 此文件为www.ycl.cool主网站及其附属页公用函数库，可按需要删除未用到的函数;<br>
## 主页面 -- index.html
此处可以根据需要查看的角色的属性和命途进行选择。<br>
![主页面](https://www.ycl.cool/blog/usr/uploads/2024/02/2075302797.png "主页面")<br>
点击未分类模型会绕过立绘查看页直接跳转到3d.html并使用data2.json。<br>
data2.json示例:
```
"4": {  // 模型编号
    "name": "流萤",    // 模型名称
    "from": "神帝宇",  // 模型来自
    "data":"3,1",     // 表格位置
    "mmd": true,      // 是否可以使用mmd动作
    "weapons": 0,     // 有几个附属模型
    "other": "烧鸡，你最好让她还能活着出现!"  // 吐槽
},
```
URL参数示例:
```
https://sr.ycl.cool/3d.html?id=4&other=1 (id=4:使用模型ID为4的模型, other=1:使用data2.json)
```
点击对应的角色名字将进入立绘查看页，此处可根据需要下载立绘或返回主页。<br>
![立绘页面](https://www.ycl.cool/blog/usr/uploads/2024/02/810220138.png "立绘页面")<br>
点击查看3D模型后会从data.json里读取模型ID并传递给3D页面。<br>
data.json示例:
```
"1": {  // 人物编号
    "name": "艾丝妲",  // 名称
    "data": "4,2",    // 表格位置 (前者为命途后者为战斗属性)
    "picurl": "/f/fb/t3l8ksl1j60xbi9zpfdhj8w2wb5hibh.png", // 立绘地址
    "firstup": "V1.0", // 人物首次跃迁版本 
    "urlroot": true,  // 立绘地址根域名是否为 wiki.biligame.com
    "model": true,    // 是否有3D模型
    "weapons": 1      // 人物有几个武器模型
},
```
若网站带宽充足，可删除"urlroot"行并替换"picurl"为本地路径，同时请删除以下代码。
```
// 判断立绘图片的所属域名前缀
if (result) {
    let picurl_root = "https://patchwiki.biligame.com/images/sr";
} else {
    let picurl_root = "https://upload-bbs.miyoushe.com/upload";
}
```
## 模型查看 -- 3d.html
点击查看将进入3D模型查看页面。(演示页面的模型在Github Page上所以可能会出现较长的加载时间)<br>
对应角色的武器会显示在角色周围。<br>
网页左侧会显示当前可以使用的模型动作文件，点击可以查看对应mmd动作.
![模型查看](https://www.ycl.cool/blog/usr/uploads/2024/02/3540012926.png "模型查看")<br>
进入页面会先行判断访问设备是否为webket内核若是则弹出提示框。
```
// 判断是否为Webkit用户
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
  alert("!!!注意!!!\n由于Webkit内核对于WebGL兼容性有限,  页面可能出现未知渲染问题。\n若可能请更换非Webkit内核浏览器访问。")
}
```
当模型读取成功时控制台会输出详细信息。<br>
正常读取示例:
```
Model:
 ID:1 Name:艾丝妲 From:神帝宇 Weapons:1
```
带mmd动作读取示例:
```
Model:
 ID:1 Name:艾丝妲 From:神帝宇
Animation:
 ID:1 Name:极乐净土 From:だんぶち
```

[URL1]:https://www.mihoyo.com/
[URL2]:https://www.bilibili.com/read/cv23111427/
[URL3]:https://sr.ycl.cool/