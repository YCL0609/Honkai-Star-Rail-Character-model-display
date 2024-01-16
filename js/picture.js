var id = getUrlParams('id');
var dataurl = "./data.json"
var listdata = [0, "物理", "火", "冰", "雷", "风", "量子", "虚数"]
var linedata = [0, "毁灭", "巡猎", "智识", "同谐", "虚无", "存护", "丰饶"]
if (typeof id === 'undefined') {
    id = 0
}
// 姓名
json(dataurl, id, "name", (result) => {
    document.getElementById('name').innerHTML = result
})
// 属性
json(dataurl, id, "data", (result) => {
    var parts = result.split(",");
    var line = parts[0];
    var list = parts[1];
    // 命途
    document.getElementById('line').innerText = linedata[line];
    // 战斗属性
    document.getElementById('list').innerText = listdata[list];
});
// 模型
json(dataurl, id, "model", (result) => {
    var model = document.getElementById('model');
    var btn = document.createElement('button');
    if (id == 4 || id == 45) {
        // 开拓者
        btn.innerText = "男主";
        btn.onclick = () => { window.location.href = "3d.html?id=4&data=1" };
        model.appendChild(btn);
        var btn2 = document.createElement('button');
        btn2.innerText = "女主";
        btn2.onclick = () => { window.location.href = "3d.html?id=4&data=2" };
        model.appendChild(btn2);
    } else if (result) {
        btn.innerText = "查看";
        btn.onclick = () => { window.location.href = "3d.html?id=" + id };
        model.appendChild(btn);
    } else {
        model.innerHTML = "<a style='color:red'>暂缺</a>";
    }
});
// 立绘
json(dataurl, id, "urlroot", (result) => {
    // 判断立绘图片的所属域名前缀
    if (result) {
        var picurl_root = "https://patchwiki.biligame.com/images/sr";
    } else {
        var picurl_root = "https://upload-bbs.miyoushe.com/upload";
    }
    // 立绘图片地址
    json(dataurl, id, "picurl", function (result) {
        document.getElementById('img1').src = picurl_root + result;
    })
})
if (id == 4 || id == 45) {
    // 开拓者
    json(dataurl, id, "picurl2", (result) => {
        var imgdiv = document.getElementById('imgdiv');
        var img2 = document.createElement('img');
        img2.id = "img2";
        img2.src = "https://patchwiki.biligame.com/images/sr" + result;
        imgdiv.appendChild(img2);
    })
    var pic = document.getElementById('picture');
    var download2 = document.createElement('button');
    download2.innerText = "女主";
    download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank') };
    pic.appendChild(download2);
    document.getElementById('btn').innerText = "男主";
}