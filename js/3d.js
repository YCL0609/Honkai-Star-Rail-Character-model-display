let serverURL, vmdfile, mp3file, resLoad = []
const Debug = getUrlParams('serverdebug') ? false : isDebug();
const threePath = setupImportMap();
if (/WebKit/i.test(navigator.userAgent) && !/(Chrome|android)/i.test(navigator.userAgent)) {
    // Webkit内核判断
    alert('由于Webkit内核对于WebGL兼容性有限, 页面可能出现未知渲染问题。\nDue to the limited compatibility of the Webkit kernel for WebGL, pages may have unknown rendering issues.')
}
initServer();// 服务器初始化
Promise.all([
    loadExternalResource(`${threePath}/es-module-shims.js`, 'js', null, () => {/* UI */ }),
    loadExternalResource(`${threePath}/three.js/libs/ammo.wasm.js`, 'js', null, () => {/* UI */ })
])
    .then((huh) => {
        console.log(huh)
    })
    .catch((e) => {
        console.log(e)
    })

async function initServer() {
    let onload = 0
    let serverID = getUrlParams('server') || '';
    const serverList = ['//139.224.2.122', '//globe-res-sr.ycl.cool', '//ycl069.github.io'];
    // 服务器选择
    if (!isNaN(serverID) || serverID < 0 || serverID > 2) {
        try {
            const servers = await ServerChoose(serverList, true);
            serverID = chooseServer(servers)
            serverURL = Debug ? "//127.0.0.1:8080" : serverList[serverID]
        } catch (_) {
            handleServerError('服务器初始化错误: 无可用服务器! - All servers have timed out or had an error in their response');
            return;
        }
    }
    // 依赖文件加载

    document.getElementById('text0').innerText = "(2/5)加载依赖文件...";
    document.getElementById('texte0').innerText = "(2/5)Load dependency files...";
    document.getElementById('jsload').style.display = "";

    function loadMainJS() {
        if (onload == 1) {
            loadExternalResource(`js/3d.module.js`, 'js', true, () => {
                document.getElementById('text0').innerText = "(2/5)加载three.js...";
                document.getElementById('texte0').innerText = "(2/5)Loading three.js...";
                document.getElementById('jsload').style.display = "none";
            });
        } else {
            onload++
        }
    }
}

// 服务器筛选
function chooseServer(servers) {
    const validServers = servers.filter(s => !s.isError);
    if (validServers.length === 0) throw new Error();

    const fastestServer = validServers.reduce((fastest, current) =>
        current.elapsedTime < fastest.elapsedTime ? current : fastest
    );
    return servers.indexOf(fastestServer);
}

// 服务器错误处理
function handleServerError(text) {
    const div = document.createElement('div');
    div.className = "poop";
    div.style.backgroundColor = "#f00000e0";
    const b = document.createElement('b');
    b.textContent = text;
    div.appendChild(b);
    document.getElementById('error').append(div);
    const progressBar = document.getElementById('progress0');
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "#f00";
    document.getElementById('ServerChoose').style.display = ""
}

// 动态生成ImportMap
function setupImportMap() {
    const threePath = Debug ? './js/3d' : `${serverURL}/js`;
    const importMap = {
        imports: {
            "WebUI": "./js/UI.js",
            "three": `${threePath}/three.js/three.module.min.js`,
            "three/": `${threePath}/three.js/`
        }
    };
    const importMapElement = document.createElement('script');
    importMapElement.type = 'importmap';
    importMapElement.textContent = JSON.stringify(importMap);
    document.head.appendChild(importMapElement);
    return threePath
}

// VMD动作文件
function Gotovmd(cho) {
    let id = getUrlParams('id');
    let other = getUrlParams('other');
    if (!other) {
        window.location.href = "3d.html?id=" + id + "&vmd=" + cho;
    } else {
        window.location.href = "3d.html?id=" + id + "&other=1" + "&vmd=" + cho;
    }
}

// 用户服务器选择
function userChooseServer() {
    let url = location.href;
    let txt = (url.substring(url.length - 4) == "html") ? "?" : "&";
    location.href = location.href + txt + "server=" + document.getElementById('server').value;
}