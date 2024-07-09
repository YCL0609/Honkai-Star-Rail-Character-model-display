let data, vmd, id
let other = getUrlParams('other'); // 模型数据
const dataurl = other ? "data2.json" : "data.json";
try { data = await ReadJson(dataurl, null, null, true) } catch (e) { Error(0, e) }
const total = data[0]['total'];
console.log('UI.js version: 2.1.0709');

export async function Init(callback) {
    try {
        vmd = getUrlParams('vmd');
        vmd = vmd ? vmd : 0;
        id = getUrlParams('id');
        Progress.main(2);
        localStorage.setItem('onload', 0);
        localStorage.setItem('onload_bg', 0);
        document.getElementById('skybox').style.display = null;
        document.getElementById('module').style = null;
        document.getElementById('background').style = null;
        const idisnum = parseInt(id);
        if (isNaN(idisnum) || idisnum < 1 || idisnum > total) { Error(1, 'The parameter is invalid', ":参数'id'不是数字或在可接受范围外") }
        const roledata = data[id]
        let name = other ? roledata['folder'] : id;
        if (roledata['special']) { name = roledata['folder'] + (getUrlParams(roledata['special']) ? `_${roledata['special']}` : '') }
        if (isNaN(parseInt(vmd)) || vmd < 0 || vmd > 3) { Error(2, 'The parameter is invalid', ":参数'vmd'不是数字或在可接受范围外") };
        callback([name, vmd, id, other, roledata['weapons']]);
    } catch (e) {
        Error(0, e)
    }
}

export function Error(code, error, errtext = '') {
    const Info = [
        "初始化错误",
        "URL参数错误",
        "three.js初始化错误",
        "天空盒加载错误",
        "场景模型加载错误",
        "人物模型加载错误",
        "武器模型加载错误",
        "MMD声音文件加载错误"
    ]
    const PoopDiv = document.createElement('div');
    const b = document.createElement('b');
    PoopDiv.classList = "poop";
    PoopDiv.style.backgroundColor = "#f00000e0";
    b.innerHTML = `${Info[code]}${errtext} - ${error}`;
    PoopDiv.appendChild(b);
    document.getElementById('error').append(PoopDiv);
}

export function Start(divid, id, cn, en) {
    let info = document.createElement('div');
    info.id = divid;
    info.innerHTML = `
    <a>${cn}</a><a id="text${id}" class="text">等待启动...</a><br>
    <a>${en}</a><a id="texte${id}" class="text">Waiting for the start...</a>
    <div class="progress">
      <div id="progress${id}" class="progress-inside" style="width: 0%"></div>
    </div>`;
    document.getElementById('info-main').appendChild(info);
}


export const Progress = {
    main: (num) => {
        let info = [], infoe = []
        info[2] = "初始化加载器..."
        infoe[2] = "Initialize the loader..."
        info[3] = "等待响应..."
        infoe[3] = "Waiting for a response..."
        document.getElementById('text0').innerText = `(${num}/4)${info[num]}`;
        document.getElementById('texte0').innerText = `(${num}/4)${infoe[num]}`;
        document.getElementById('progress0').style.width = `${num * 25}%`;
    },

    Model: (id, xhr, text = '', texten = '') => {
        document.getElementById(`text${id}`).innerText = text + "(" + (xhr.loaded / 1024).toFixed(0) + " KB/" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById(`texte${id}`).innerText = texten + "(" + (xhr.loaded / 1024).toFixed(0) + " KB/" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById(`progress${id}`).style.width = (xhr.loaded / xhr.total * 100) + "%";
    }
}

export const Finish = {
    Skybox: (isError) => {
        if (isError) {
            document.getElementById('progress3').style.backgroundColor = "red"
        }
        document.getElementById('text3').innerText = "天空盒加载完成.";
        document.getElementById('texte3').innerText = "Skybox loading finish.";
        document.getElementById('progress3').style.width = "100%";
        setTimeout(() => {
            document.getElementById('skybox').style.display = "none";
            if (vmd) { Finish.MMD(); } else { Finish.Auto(); }
        }, 2000);
    },

    Auto: async () => {
        let dataurl = other ? "data2.json" : "data.json";
        let roledata = await ReadJson(dataurl, id, 0, false, true)
        let total = localStorage.onload;
        if (total != (2 + roledata['weapons'])) {
            total++;
            localStorage.setItem('onload', total);
            return;
        };
        gui();
        let from = other ? roledata['from'] : "神帝宇";
        let main = document.getElementById('main');
        let ok = document.getElementById('start');
        let a = document.createElement('h4');
        ok.onclick = () => { document.getElementById('info').style.display = "none"; };
        document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
        document.getElementById('texte0').innerText = "Loading finish, please wait for the material download.";
        document.getElementById('progress0').style.width = "100%";
        a.innerHTML = `模型来源: ${from}<br><br>Model from: ${from}`;
        a.style.textAlign = "center"
        main.appendChild(a);
        setTimeout(() => { document.getElementById('info').style.display = "none" }, 2000)
        console.log("Model:\n ID:" + id + " From:" + from + " Weapons:" + roledata['weapons']);
    },

    Model: (id1, id1en, id2, text = '') => {
        document.getElementById(id1).innerText = text + "加载完成, 请等待材质下载.";
        document.getElementById(id1en).innerText = text + "Loading finish, please wait for the material download.";
        setTimeout(() => {
            document.getElementById(id2).style.display = "none";
            if (vmd) { Finish.MMD(); } else { Finish.Auto(); }
        }, 2000);
    },

    MMD: async () => {
        let roledata = await ReadJson(dataurl, id, 0, false, true)
        let vmddata = await ReadJson('vmd/data.json', vmd, 0, false, true);
        let total = localStorage.onload;
        if (total != 3) {
            total++;
            localStorage.setItem('onload', total);
            return;
        }; gui();
        const from = other ? roledata['from'] : "神帝宇";
        const main = document.getElementById('main');
        [`<br>`,
            `模型来源: ${from}<br>`,
            `Model source: ${from}<br><br>`,
            `动作来源: ${vmddata['from']}<br>`,
            `Action source: ${vmddata['from']}<br><br>`,
            `背景音乐: ${vmddata['name']}<br>`,
            `Background music: ${vmddata['name']}<br><br>`,
            `制作软件: three.js<br>`,
            `Make software: three.js<br><br>`
        ].map((text) => {
            const a = document.createElement('a');
            a.style.margin = "0 auto"
            a.innerHTML = text;
            main.appendChild(a)
        });
        document.getElementById('start').style = null;
        console.log("Model:\n ID:" + id + " From:" + from + "\nAnimation:\n ID:" + vmd + " Name:" + vmddata['name'] + " From:" + vmddata['from']);
    }
}

function gui() {
    let title = document.getElementsByClassName('title');
    for (let i = 0; i < title.length; i++) {
        title[i].click();
    }
    document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
    document.getElementById('texte0').innerText = "Loading finish, please wait for the material download.";
    document.getElementById('progress0').style.width = "100%";
    document.getElementById('VMDList').style.left = "0px";
    document.getElementById('three').style.top = "-60px";
}