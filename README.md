# 崩坏：星穹铁道角色模型展示
English version please see [README_EN.md][en]
## 前言
官方模型及立绘素材的权利归米哈游所有, 其他内容的相关权利均归各自所有者享有. 如有侵权, 请向 [email@ycl.cool][0] 发送邮件.
## outsite目录
目录内为引用的其他网站js文件副本。<br>
&nbsp;&nbsp;&nbsp;function.js — 此文件为www.ycl.cool主网站及其附属页公用函数库，可按需要删除未用到的函数;<br>
## 主页面 -- index.html
此网页可更换显示语言，表格可以根据需要查看的角色的属性和命途进行选择。<br>
<br>
点击未分类模型会绕过立绘查看页直接跳转到3d.html并使用data2.json。<br>
data2.json示例:

```json
"3": {  // 模型编号
    "folder": "Other3",  // 模型文件夹
    "from": "给你柠檬椰果养乐多你会跟我玩吗",  // 模型来自
    "data": "1,2",  // 表格位置
    "weapons": 0  // 有几个附属模型
}
```

URL参数示例:

```
https://sr.ycl.cool/3d.html?id=3&other (id=3:使用模型ID为4的模型, other:使用data2.json)
```
![main][1]

点击已分类的对应角色名字将进入立绘查看页，此处可根据需要下载立绘或返回主页。<br><br>
点击查看3D模型后会从data.json里读取模型ID并传递给3D页面。<br>
data.json示例:

```json
"1": {  // 人物编号
    "data": "4,2",  // 表格位置
    "firstup": "V1.0",  // 人物首次跃迁版本
    "model": true,  // 是否有3D模型
    "weapons": 1   // 人物有几个武器模型
},
```

中文data.json示例:

```json
"0": {
    "urlroot1": "https://patchwiki.biligame.com/images/sr", // 第一立绘网站根地址
    "urlroot2": "https://upload-bbs.miyoushe.com/upload"   // 第二立绘网站根地址
},
"1": {  // 人物编号
    "name": "艾丝妲",  // 人物名称
    "picurl": "/f/fb/t3l8ksl1j60xbi9zpfdhj8w2wb5hibh.png", // 立绘地址
    "urlroot": true  // 是否使用urlroot1
},
```

若网站带宽充足，可删除"urlroot"行并替换"picurl"为本地路径，同时请删除以下代码。

```javascript
let picurl_root = name[id]['urlroot'] ? name[0]['urlroot1'] : name[0]['urlroot2'] // 判断立绘图片的所属域名前缀

```
![picture][2]

## 模型查看 -- 3d.html
点击查看将进入3D模型查看页面。(演示页面的模型在Github Page上所以可能会出现较长的加载时间)<br>
对应角色的武器会显示在角色周围。<br>
网页左侧会显示当前可以使用的模型动作文件，点击可以查看对应mmd动作.
进入页面会先行判断访问设备是否为webket内核若是则弹出提示框。

```javascript
// 判断是否为Webkit用户
let isSafari = /WebKit/i.test(navigator.userAgent) && !/(Chrome|android)/i.test(navigator.userAgent);
if (isSafari) {
	alert('由于Webkit内核对于WebGL兼容性有限, 页面可能出现未知渲染问题。\nDue to the limited compatibility of the Webkit kernel for WebGL, pages may have unknown rendering issues.')
}
```

当模型读取成功时控制台会输出详细信息。<br>
正常读取示例:
```
Model:
 ID:51 From:神帝宇 Weapons:0
```
![3d][3]
带mmd动作读取示例:
```
Model:
 ID:5 From:神帝宇
Animation:
 ID:1 Name:极乐净土 From:だんぶち
```
![mmd][4]

[en]: README_EN.md
[0]: mailto:email@ycl.cool
[1]: https://www.ycl.cool/blog/usr/uploads/2024/06/786176234.jpg
[2]: https://www.ycl.cool/blog/usr/uploads/2024/06/2019666578.jpg
[3]: https://www.ycl.cool/blog/usr/uploads/2024/06/3134407100.jpeg
[4]: https://www.ycl.cool/blog/usr/uploads/2024/06/2736328017.jpeg
