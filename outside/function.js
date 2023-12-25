// 判断访问设备
function isMobile() {
    var userAgentInfo = navigator.userAgent;
    var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var mobile_flag = false;
    // 根据userAgent判断是否是手机
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
    var screen_width = window.screen.width;
    var screen_height = window.screen.height;
    // 根据屏幕分辨率判断是否是手机
    if (screen_width < 500 && screen_height < 800) {
        mobile_flag = true;
    }
    return mobile_flag;
}

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;
        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        } else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

// 网页URL参数获取
function getUrlParams(name) {
    // 不传name返回所有值，否则返回对应值
    var url = window.location.search;
    if (url.indexOf('?') == 1) { return false; }
    url = url.substr(1);
    url = url.split('&');
    var name = name || '';
    var nameres;
    // 获取全部参数及其值
    for (var i = 0; i < url.length; i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    // 如果传入一个参数名称，就匹配其值
    if (name) {
        for (var i = 0; i < url.length; i++) {
            for (const key in url[i]) {
                if (key == name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    // 返回结果
    return nameres;
}

// Json处理
function json(url, val1, val2, callback) {
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

console.log(`

+---------------------------------------------------------+

         o     o          o o o          o
           o o           o               o
            o           o                o
            o            o               o
            o             o o o          o o o o         
            
+---------------------------------------------------------+

我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹！--京阿尼《日常》
`)