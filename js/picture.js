var id = getUrlParams('id');
var dataurl = "./data.json"
if (typeof id === 'undefined') {
    id = 0
}
// 姓名
json(dataurl,id, "name", (result) => {
    document.getElementById('name').innerHTML = result
})
// 属性
json(dataurl,id, "data", (result) => {
    var parts = result.split(",");
    var line = parts[0];
    var list = parts[1];
    // 战斗属性
    switch (list) {
        // 物理
        case '1':
            var list_a = "物理";
            break;
        // 火
        case '2':
            var list_a = "火";
            break;
        // 冰
        case '3':
            var list_a = "冰";
            break;
        // 雷
        case '4':
            var list_a = "雷";
            break;
        // 风
        case '5':
            var list_a = "风";
            break;
        // 量子
        case '6':
            var list_a = "量子";
            break;
        // 虚数
        case '7':
            var list_a = "虚数";
            break;
        // 错误参数
        default:
            var list_a = "未知";
            break;
    }
    // 命途
    switch (line) {
        // 毁灭
        case '1':
            var line_a = "毁灭";
            break;
        // 巡猎
        case '2':
            var line_a = "巡猎";
            break;
        // 智识
        case '3':
            var line_a = "智识";
            break;
        // 同谐
        case '4':
            var line_a = "同谐";
            break;
        // 虚无
        case '5':
            var line_a = "虚无";
            break;
        // 存护
        case '6':
            var line_a = "存护";
            break;
        // 丰饶
        case '7':
            var line_a = "丰饶";
            break;
        // 错误参数
        default:
            var line_a = "未知";
            break;
    }
    document.getElementById('line').innerText = line_a;
    document.getElementById('list').innerText = list_a;
});
// 模型
json(dataurl,id, "model", (result) => {
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
json(dataurl,id, "urlroot", (result) => {
    // 判断立绘图片的所属域名前缀
    if (result) {
        var picurl_root = "https://patchwiki.biligame.com/images/sr";
    } else {
        var picurl_root = "https://upload-bbs.miyoushe.com/upload";
    }
    // 立绘图片地址
    json(dataurl,id, "picurl", function (result) {
        document.getElementById('img1').src = picurl_root + result;
    })
})
if (id == 4 || id == 45) {
    // 开拓者
    json(dataurl,id, "picurl2", (result) => {
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