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
 * @param {boolean} isModule js资源是否为module
 * @param {function} callback 可选的回调函数，加载完成后调用如出现错误则传入参数
 * @returns {Promise} 返回一个Promise对象
 */
function loadExternalResource(url, type, isModule, callback) {
    return new Promise((resolve, reject) => {
        let tag;
        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        } else if (type === "js") {
            tag = document.createElement("script");
            if (isModule) tag.type = "module";
            tag.src = url;
        } else {
            reject(new Error("参数不合法"))
            return
        }
        tag.onload = () => {
            resolve();
            if (typeof callback === 'function') { callback() }
        }
        tag.onerror = (error) => {
            console.error(error);
            reject(new Error(`Failed to load ${url}`));
            if (typeof callback === 'function') { callback(new Error(`Failed to load ${url}`)); }
        };
        document.head.appendChild(tag);
    });
}


/**
 * 网页URL参数获取
 *  @param {string} name 不传返回所有值，传入则返回对应值
 *  @returns {string} 参数值
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
 * @param {boolean} [isConsole=false] 是否将结果输出到控制台
 * @returns {Promise<object[]>} 一个对象数组，包含每个服务器的 URL、耗时、是否出错、出错信息、是否最快等信息
 * @description 该函数会并发地测试每个服务器的响应速度，并返回一个Json对象
 */
async function ServerChoose(TestURLs, isConsole = false) {
    const results = await Promise.all(
        TestURLs.map(async (url, index) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const start = performance.now();
            try {
                const response = await fetch(`${url}/test.bin`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error('Fetch error');
                await response.arrayBuffer();
                return ({ url: url, elapsedTime: performance.now() - start, index });
            } catch (error) {
                clearTimeout(timeoutId);
                return ({ url: url, elapsedTime: performance.now() - start, error, index });
            }
        })
    );
    const minElapsedTime = Math.min(...results.map(r => r.elapsedTime));
    const resultsArray = results.map(result => ({
        url: result.url,
        elapsedTime: result.elapsedTime,
        isError: !!result.error,
        error: result.error,
        isFastest: result.elapsedTime === minElapsedTime,
        index: result.index
    }));
    if (isConsole) {
        resultsArray.map(e => {
            console.log(`URL: ${e.url} 响应时间: %c${e.elapsedTime}ms %c出错: %c${e.isError}${e.isError ? `\n${e.error.stack}` : ''}`, `color:${e.isFastest ? '#0ff' : '#fff'}`, 'color:#fff', `color:${e.isError ? '#f00' : '#0f0'}`)
        })
    }
    return resultsArray;
}

/**
 * 检查是否处于调试模式
 * @returns {boolean} 是否处于调试模式
 */
function isDebug() {
    const urldebug = getUrlParams('debug');
    const hostdebug = /^localhost|^127(?:\.0(?:\.0(?:\.0?)?)?\.0?)|(?:0*:)?::1$/i.test(window.location.hostname);
    return urldebug || hostdebug
}
/**
* 生成指定长度的随机字符串
* @param {number} length - 随机字符串的长度, 默认32位
* @returns {string} 一个长度为 length 的随机字符串
*/
function RandomString(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// YCL
console.log(
    `+---------------------------------------------------------+

         %co     o          %co o o          %co
           %co o           %co               %co
            %co           %co                %co
            %co            %co               %co
            %co             %co o o          %co o o o%c    
            
+--------------------------------------------------------+

我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹！--京阿尼《日常》`,
    'color:#ff0', 'color:#0f0', 'color:#0ff',
    'color:#ff0', 'color:#0f0', 'color:#0ff',
    'color:#ff0', 'color:#0f0', 'color:#0ff',
    'color:#ff0', 'color:#0f0', 'color:#0ff',
    'color:#ff0', 'color:#0f0', 'color:#0ff',
    'color #fff')