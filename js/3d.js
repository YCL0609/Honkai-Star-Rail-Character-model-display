const Debug = isDebug();
initServer() // 服务器初始化
    .then(serverURL => { // 加载依赖文件
        document.getElementById('text0').innerText = "(2/5)加载依赖文件...";
        document.getElementById('texte0').innerText = "(2/5)Load dependency files...";
        document.getElementById('progress0').style.width = `20%`;
        document.getElementById('jsload').style.display = "";
        Promise.all([
            loadExternalResource(`${serverURL}/js/es-module-shims.js`, 'js', null, (e) => {
                if (e) {
                    info = "<b style='color:red'>Error!</b>"
                } else {
                    info = "<b style='color:#0f0'>Success!</b>"
                }
                document.getElementById('jsload1').innerHTML = info
            }),
            loadExternalResource(`${serverURL}/js/three.js/libs/ammo.wasm.js`, 'js', null, (e) => {
                if (e) {
                    info = "<b style='color:red'>Error!</b>"
                } else {
                    info = "<b style='color:#0f0'>Success!</b>"
                }
                document.getElementById('jsload2').innerHTML = info
            }),
        ])
            .then(() => { // 加载three.js文件
                setupImportMap(serverURL) // 生成ImportMap
                window.serverURL = serverURL;
                loadExternalResource(`js/3d.module.js`, 'js', true) // three.js控制文件
                document.getElementById('jsload').innerHTML = "<b>首次或长时间未打开(缓存失效)时加载时间会加长，请耐心等待...</b><br><b>The loading time will be longer when it is not opened for the first time or for a long time (cache invalidation), please be patient...</b>";
            })
            .catch(() => handleServerError('服务器初始化错误:依赖文件加载错误! - Dependency files are not loaded correctly'))
    }).catch(() => handleServerError('服务器初始化错误:无可用服务器! - All servers have timed out or had an error in their response'));

// 选择服务器
async function initServer() {
    let server = getUrlParams('server'); // 用户服务器选择处理
    if (server === 1) return Promise.resolve("//139.224.2.122");
    if (server === 2) return Promise.resolve("//server1.ycl.cool/srroot");
    if (Debug) return Promise.resolve("//127.0.0.1:8081");
    const response = await fetch('?cf_iscn&' + RandomString(64), { method: 'HEAD' });
    return response.headers.has('iscn') ? "//139.224.2.122" : "//server1.ycl.cool/srroot";
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
function setupImportMap(Path) {
    const importMap = {
        imports: {
            "WebUI": "./js/UI.js",
            "three": `${Path}/js/three.js/three.module.min.js`,
            "three/": `${Path}/js/three.js/`
        }
    };
    const importMapElement = document.createElement('script');
    importMapElement.type = 'importmap';
    importMapElement.textContent = JSON.stringify(importMap);
    document.head.appendChild(importMapElement);
}

// 用户服务器选择
function userChooseServer() {
    let url = location.href;
    let txt = (url.substring(url.length - 4) == "html") ? "?" : "&";
    location.href = location.href + txt + "server=" + document.getElementById('server').value;
}

// VMD文件处理
function VMD_process(para) {
    const main = document.getElementById('useVMD');
    const cho = document.getElementById('VMDchoose');
    const list = document.getElementById('VMDlist');
    const local = document.getElementById('localVMD');
    switch (para) {
        case 'open':
            main.style.display = "";
            cho.style.display = "";
            list.style.display = "none";
            local.style.display = "none";
            break;
        case 'close':
            main.style.display = "none";
            break;
        case 'list':
            cho.style.display = "none";
            list.style.display = "";
            break;
        case 'local': // 使用本地文件
            let islocal = getUrlParams('localvmd');
            if (islocal === null || islocal === undefined) {
                location.href = location.href + "&localvmd=y"
            } else { location.reload() }
            break;
        case 'load':
            main.style.display = "none";
            window.loadok = true;
            break;
        case 'online':
            cho.style.display = "none";
            list.style.display = "";
            break;
        case 1: // 使用现有文件
        case 2:
        case 3:
            let id = getUrlParams('id');
            let other = getUrlParams('other');
            if (!other) {
                window.location.href = "3d.html?id=" + id + "&vmd=" + para;
            } else {
                window.location.href = "3d.html?id=" + id + "&other=y&vmd=" + para;
            }
            break;
        default:
            main.style.display = "none";
            cho.style.display = "none";
            list.style.display = "none";
            local.style.display = "none";
            break;
    }
}