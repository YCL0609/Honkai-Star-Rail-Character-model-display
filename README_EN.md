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
"5": {  // Model number
    "folder": "sr_March7th",  // Model folder
    "from": "给你柠檬椰果养乐多你会跟我玩吗",  // Model source
    "data": "1,2",  // Table position
    "weapons": 0  // Number of associated models
}
```

URL parameter example:

```
https://sr.ycl.cool/3d.html?id=3&other=y (id=3: use the model with ID 4, other=y: use data2.json)
```
![main][1]

Click on the name of the corresponding character in the category to view the portrait, which you can download or return to the main page if you want. <br><br>
When you click View 3D Model, the current model ID will be passed to the 3D page. <br>
data.json example:

```json
"1": {  // Character number
    "data": "4,2",  // Table position
    "firstup": "V1.0",  // Character's first ascension version
    "special": "iswhite", // Is there a second master model
    "folder": 46,  // If the previous row exists, the folder where this behavior model is located
    "model": true,  // Whether there is a 3D model
    "weapons": 1  // Number of weapon models the character has
},
```

English data.json example:

```json
"46": { // Character number
    "name": "Acheron", // Character name
    "special": [ // If there is a second master model
        "Normal", // Normal name
        "Ultimate" // Name of second master model
    ]
}

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