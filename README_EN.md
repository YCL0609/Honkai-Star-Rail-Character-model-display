# Honkai:Star Rail Character model display
中文请查看 [README.md][cn]
## Preface
The rights to official models and portrait materials are owned by miHoYo. The rights to other content belong to their respective owners. If there is any infringement, please send an email to [Star-Rail-model-display@ycl.cool][0]. (This email does not reply to emails and is only used to hide the real email address.)<br>
If you encounter something different from Chinese, please use Chinese as the main one, if you want to change it, please submit it on Github.
## Outsite Directory
The directory contains copies of JavaScript files referenced from other websites.<br>
&nbsp;&nbsp;&nbsp;function.js — This file is the public function library of the main website www.ycl.cool and its affiliated pages, and unused functions can be deleted as needed;<br>
## Main Page -- index.html
This webpage can switch display language, and the table can be used to select the attributes and destiny of the characters as needed.<br>
<br>
Clicking on unclassified models will skip the portrait view page and directly jump to 3d.html using data2.json.<br>
data2.json example:

```json
"3": {  // Model number
    "folder": "Other3",  // Model folder
    "from": "给你柠檬椰果养乐多你会跟我玩吗",  // Model source
    "data": "1,2",  // Table position
    "weapons": 0  // Number of associated models
}
```

URL parameter example:

```
https://sr.ycl.cool/3d.html?id=3&other (id=3: use the model with ID 4, other: use data2.json)
```
![main][1]

Clicking on the corresponding character name in the classified section will enter the portrait view page, where you can download or return to the main page as needed.<br><br>
Clicking to view the 3D model will read the model ID from data.json and pass it to the 3D page.<br>
data.json example:

```json
"1": {  // Character number
    "data": "4,2",  // Table position
    "firstup": "V1.0",  // Character's first ascension version
    "model": true,  // Whether there is a 3D model
    "weapons": 1  // Number of weapon models the character has
},
```

Chinese data.json example:

```json
"0": {
    "urlroot1": "https://patchwiki.biligame.com/images/sr", // First portrait website root address
    "urlroot2": "https://upload-bbs.miyoushe.com/upload"   // Second portrait website root address
},
"1": {  // Character number
    "name": "Asta",  // Character name
    "picurl": "/f/fb/t3l8ksl1j60xbi9zpfdhj8w2wb5hibh.png", // Portrait address
    "urlroot": true  // Whether to use urlroot1
},
```

If the website bandwidth is sufficient, the "urlroot" line can be deleted and "picurl" can be replaced with a local path. Also, please delete the following code.

```javascript
let picurl_root = name[id]['urlroot'] ? name[0]['urlroot1'] : name[0]['urlroot2'] // 判断立绘图片的所属域名前缀
```
![picture][2]

## Model View -- 3d.html
Clicking to view will enter the 3D model view page. (The models on the demo page are on the Github Page, so there may be a longer loading time.)<br>
The character's weapons will be displayed around the character.<br>
The webpage's left side will show the current available model motion files, and clicking can view the corresponding mmd actions.
Upon entering the page, it will first check whether the visiting device is using the WebKit kernel, and if so, a prompt box will appear.

```javascript
// 判断是否为Webkit用户
let isSafari = /WebKit/i.test(navigator.userAgent) && !/(Chrome|android)/i.test(navigator.userAgent);
if (isSafari) {
	alert('由于Webkit内核对于WebGL兼容性有限, 页面可能出现未知渲染问题。\nDue to the limited compatibility of the Webkit kernel for WebGL, pages may have unknown rendering issues.')
}
```

When the model is successfully loaded, detailed information will be output to the console.<br>
Normal loading example:
```
Model:
 ID:51 From:Shen Di Yu Weapons:0
```
![3d][3]
Loading with mmd action example:
```
Model:
 ID:5 From:Shen Di Yu
Animation:
 ID:1 Name:Pure Land From:Dànbùchí
```
![mmd][4]

[cn]: README.md
[0]: mailto:Star-Rail-model-display@ycl.cool
[1]: https://www.ycl.cool/blog/usr/uploads/2024/06/786176234.jpg
[2]: https://www.ycl.cool/blog/usr/uploads/2024/06/2019666578.jpg
[3]: https://www.ycl.cool/blog/usr/uploads/2024/06/3134407100.jpeg
[4]: https://www.ycl.cool/blog/usr/uploads/2024/06/2736328017.jpeg