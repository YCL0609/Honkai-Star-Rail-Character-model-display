/**
 * 判断访问设备
 * @returns {boolean} true为手机, false为电脑
 */
function isMobile() {
    var userAgentInfo = navigator.userAgent;
    var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var mobile_flag = false;
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
    var screen_width = window.screen.width;
    var screen_height = window.screen.height;
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
    for (var i = 0; i < url.length; i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
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
    return nameres;
}

/**
 * Json处理函数
 * @param {string} url Json文件URL路径
 * @param {string} val1 返回Json数据键名
 * @param {string} val2 返回Json数据对象名
 * @param {boolean} all 是否返回全部Json数据
 * @param {boolean} allkey 是否返回选定键值全部数据
 * @returns {string} 返回指定值
 */
function ReadJson(url, val1, val2, all, allkey) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (all) {
            return data;
        } else if (allkey) {
            return data[val1];
        } else {
            return data[val1][val2];
        }
    } else {
        throw new Error('Error reading file: ' + xhr.statusText);
    }
}

/**
 * 选择最快的服务器
 * @param {string[]} TestURLs 需要测试的服务器 URL 数组
 * @param {string[]} [suffixes=[]] 可选的 URL 后缀数组
 * @returns {Promise<object[]>} 一个对象数组，包含每个服务器的 URL、耗时、是否出错、出错信息、是否最快等信息
 * @description 该函数会并发地测试每个服务器的响应速度，并返回一个Json对象
 */
async function ServerChoose(TestURLs, suffixes = []) {
    const results = await Promise.all(
        TestURLs.map(async (url, index) => {
            const start = performance.now();
            try {
                const response = await fetch(`${url}/test.bin`);
                if (!response.ok) throw new Error('Fetch error');
                await response.arrayBuffer();
                return ({ url: url + (suffixes[index] || ''), elapsedTime: performance.now() - start, index });
            } catch (error) {
                return ({ url: url + (suffixes[index] || ''), elapsedTime: performance.now() - start, error, index });
            }
        })
    );
    const minElapsedTime = Math.min(...results.map(r => r.elapsedTime));
    return results.map(result => ({
        url: result.url,
        elapsedTime: result.elapsedTime,
        isError: !!result.error,
        error: result.error,
        isFastest: result.elapsedTime === minElapsedTime,
        index: result.index
    }));
}

/**
 * 检查是否处于调试模式
 * @returns {boolean} 是否处于调试模式
 */
function isDebug() {
    if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
        console.log('%c正在进行本地Debug调试', 'color: aqua');
        return true
    }
    const DebugURL = 'http://127.0.0.1/Debug/3BBB21576F422600AF35AD902370651D5089F66C00AF7757F0228289630793A9.bin'
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('HEAD', DebugURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('%c正在进行本地Debug调试', 'color: aqua');
                    return true
                } else {
                    console.log('%c未检测到Debug调试环境', 'color: #0f0');
                    return false
                }
            }
        };
        xhr.send()
    } catch (_) { }
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