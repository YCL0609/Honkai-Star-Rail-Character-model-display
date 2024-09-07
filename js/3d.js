const Debug = isDebug()
initServer() // 服务器初始化
    .then(serverURL => { // 加载依赖文件
        document.getElementById('text0').innerText = "(2/5)加载依赖文件...";
        document.getElementById('texte0').innerText = "(2/5)Load dependency files...";
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
                loadExternalResource(`js/3d.module.js`, 'js', true, () => { // 加载主文件
                    document.getElementById('text0').innerText = "(2/5)加载three.js...";
                    document.getElementById('texte0').innerText = "(2/5)Loading three.js...";
                    document.getElementById('jsload').style.display = "none";
                })
            })
            .catch(() => handleServerError('服务器初始化错误:依赖文件加载错误! - Dependency files are not loaded correctly'))
    }).catch(() => handleServerError('服务器初始化错误:无可用服务器! - All servers have timed out or had an error in their response'));

// 选择服务器
async function initServer() {
    let server = getUrlParams('server'); // 用户服务器选择处理
    if (server === 1) return Promise.resolve("//139.224.2.122");
    if (server === 2) return Promise.resolve("//globe-res-sr.ycl.cool");
    if (Debug) return Promise.resolve("//127.0.0.1:8081");
    const response = await fetch('?cf_iscn&' + RandomString(64), { method: 'HEAD' });
    return response.headers.has('iscn') ? "//139.224.2.122" : "//globe-res-sr.ycl.cool";
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