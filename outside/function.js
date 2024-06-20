/**
 * 判断访问设备
 * @returns {boolean} true为手机, false为电脑
 */
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

/**
 * 异步加载资源函数
 * @param {string} url 资源路径
 * @param {string} type 资源类型 (js/css)
 */
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

/**
 * 网页URL参数获取
 *  @param {string} name 不传name返回所有值，传入则返回对应值
 *  @returns {string} 对应参数值
 */
function getUrlParams(name) {
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

/**
 * Json处理函数(异步)
 * @param {string} url Json文件URL路径
 * @param {string} val1 返回Json数据键名
 * @param {string} val2 返回Json数据对象名
 * @param {boolean} all 是否返回全部Json数据
 * @param {boolean} allkey 是否返回选定键值全部数据
 * @returns {string} 返回指定值
 */
async function ReadJson(url, val1, val2, all, allkey) {
    try {
        // 使用fetch API读取JSON文件
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network Error ' + response.status);
        }
        // 将响应解析为JSON
        const data = await response.json();
        // 返回数据
        if (all) {
            return data;
        } else if (allkey) {
            return data[val1];
        } else {
            return data[val1][val2];
        }
    } catch (err) {
        throw new Error('Error reading file:' + err);
    }
}

/**
 * 最快服务器选择函数
 * @param {string} TestURL1 第一个服务器地址
 * @param {string} TestURL2 第二个服务器地址
 * @return {object} 最快的服务器信息，包含服务器地址和响应时间
 */
async function ServerChoose(TestURL1, TestURL2) {
    async function Timetest(url) {
      const start = performance.now();
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch error');
        await response.arrayBuffer();
        return ({ url, elapsedTime: performance.now() - start });
      } catch (error) {
        return ({ url, elapsedTime: performance.now() - start, error });
      }
    }
    const results = await Promise.race([
      Timetest(TestURL1),
      Timetest(TestURL2),
    ]);
    const fastest = results.reduce((a, b) => a.elapsedTime < b.elapsedTime ? a : b);
    return fastest;
  }

// YCL
console.log(
`+---------------------------------------------------------+

         o     o          o o o          o
           o o           o               o
            o           o                o
            o            o               o
            o             o o o          o o o o         
            
+---------------------------------------------------------+
我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹！--京阿尼《日常》
`)