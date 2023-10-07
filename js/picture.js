// 姓名
var rolename = getUrlParams('name');
show = true
if (typeof (rolename) == "undefined" || rolename == null) {
    rolename = "未知";
    show = false;
}
document.getElementById('name').innerText = rolename;
// 立绘
json(rolename, "urlroot", function (result) {
    // 判断立绘图片的所属域名前缀
    if (result) {
        var picurl_root = "https://patchwiki.biligame.com/images/sr";
    } else {
        var picurl_root = "https://upload-bbs.miyoushe.com/upload";
    }
    // 立绘图片地址
    json(rolename, "picurl", function (result) {
        document.getElementById('img1').src = picurl_root + result;
    });
});
// 属性
var list = getUrlParams('list');
switch (list) {
    // 物理
    case '1':
        list_a = "物理";
        break;
    // 火
    case '2':
        list_a = "火";
        break;
    // 冰
    case '3':
        list_a = "冰";
        break;
    // 雷
    case '4':
        list_a = "雷";
        break;
    // 风
    case '5':
        list_a = "风";
        break;
    // 量子
    case '6':
        list_a = "量子";
        break;
    // 虚数
    case '7':
        list_a = "虚数";
        break;
    // 错误参数
    default:
        list_a = "未知";
        break;
}
document.getElementById('list').innerText = list_a;
// 命途
var line = getUrlParams('line');
switch (line) {
    // 毁灭
    case '1':
        line_a = "毁灭";
        break;
    // 巡猎
    case '2':
        line_a = "巡猎";
        break;
    // 智识
    case '3':
        line_a = "智识";
        break;
    // 同谐
    case '4':
        line_a = "同谐";
        break;
    // 虚无
    case '5':
        line_a = "虚无";
        break;
    // 存护
    case '6':
        line_a = "存护";
        break;
    // 丰饶
    case '7':
        line_a = "丰饶";
        break;
    // 错误参数
    default:
        line_a = "未知";
        break;
}
document.getElementById('line').innerText = line_a;
// 其他
var other = getUrlParams('other');
main = false
if (typeof (other) == "undefined" || other == null) {
    if (show) {
        document.getElementById('model-no').style.display = "none";
        document.getElementById('model-normale').style.display = "";
    }
} else if (other == "0") {
    // 开拓者
    document.getElementById('model-no').style.display = "none";
    document.getElementById('model-main').style.display = "";
    document.getElementById('img2').style.display = "";
    if (line == "1") {
        // 毁灭命途
        document.getElementById('img1').src = picurl_root + "/5/58/2dishd6nydg68hp6ay0wjtpgjgjbmfz.png";
        document.getElementById('img2').src = picurl_root + "/5/51/a8tjm9d781ac6tw2vyhg5q8ss058415.png";
    } else if (line == "6") {
        // 存护命途
        document.getElementById('img2').src = picurl_root + "/2/24/g3gk5z35af2xbrhdm6jwrvdlx71lo0p.png";
    } else {
        document.getElementById('img2').src = picurl_root + "/5/51/a8tjm9d781ac6tw2vyhg5q8ss058415.png";
    }
    main = true
}

// 跳转至3D模型
function model(val) {
    json(rolename, "weapons", function (result) {
        if (val == 1) {
            window.location.href = "3d.html?name=" + rolename + "&weapons=" + result;
        } else if (val == 2) {
            window.location.href = "3d.html?name=男主&weapons=2";
        } else if (val == 3) {
            window.location.href = "3d.html?name=女主&weapons=2";
        } else {
            console.error('错误!无法获取角色名!');
        }
    })
}
// 立绘下载
function download() {
    if (main) {
        var img1 = document.getElementById('img1').src;
        var img2 = document.getElementById('img2').src;
        window.open(img1, "_blank");
        window.open(img2, "_blank");
    } else {
        var img = document.getElementById('img1').src;
        window.open(img, "_blank");
    }
}
// json处理
function json(val1, val2, callback) {
    var url = './data.json';
    // 发起GET请求获取JSON数据
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonStr = xhr.responseText;
            var jsonObj = JSON.parse(jsonStr);
            var result = jsonObj[val1][val2];
            callback(result); // 调用回调函数，并传递结果
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

