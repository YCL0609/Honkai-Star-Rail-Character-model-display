let data, vmd, id, text
let lang = getUrlParams('lang'); // 语言文件
lang = (typeof lang === 'undefined') ? 'zh' : lang;
try { text = await ReadJson(`lang/${lang}/text.json`, null, null, true) } catch (e) { Error(0, e) }
if (lang == 'zh') { Changelang(text) }
let other = getUrlParams('other'); // 模型数据
const dataurl = other ? "data2.json" : "data.json";
try { data = await ReadJson(dataurl, null, null, true) } catch (e) { Error(0, e) }
const total = data[0]['total'];
console.log('UI version: 2.0.0527')
console.log(`language setting: ${lang}`)

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
        if (isNaN(parseInt(vmd)) || vmd < 0 || vmd > 3) { Error(3, 'The parameter is invalid', ":参数'vmd'不是数字或在可接受范围外") };
        callback([name, vmd, id, other, roledata['weapons']]);
    } catch (e) {
        Error(0, e)
    }
}

export function Error(code, error, errtext = '') {
    const Info = text['errorinfo'];
    const PoopDiv = document.createElement('div');
    const b = document.createElement('b');
    PoopDiv.classList = "poop";
    PoopDiv.style.backgroundColor = "#f00000e0";
    b.innerHTML = `${Info[code]}${errtext} - ${error}`;
    PoopDiv.appendChild(b);
    document.getElementById('error').append(PoopDiv);
}

export const Start = {
    Music: () => {
        let info = document.createElement('div');
        info.id = `music`;
        info.innerHTML = `<h4>音乐文件:<a id="text4" class="text">等待启动...</a></h4>
          <div class="progress">
            <div id="progress4" class="progress-inside" style="width: 0%"></div>
          </div>`;
        document.getElementById('info-main').appendChild(info);
    },
    Weapon: (i) => {
        let info = document.createElement('div');
        info.id = `weapon${i}`;
        info.innerHTML = `<h4>武器模型${i}:<a id="text-w${i}" class="text"></a></h4>
        <div class="progress">
          <div id="progress-w${i}" class="progress-inside" style="width: 0%"></div>
        </div>`;
        document.getElementById('info-main').appendChild(info);
    }
}

export const Progress = {
    main: (num) => {
        let info = [];
        info[2] = "初始化加载器..."
        info[3] = "等待响应..."
        document.getElementById('text0').innerText = `(${num}/4)${info[num]}`;
        document.getElementById('progress0').style.width = `${num * 25}%`;
    },

    Model: (id, xhr, text = '') => {
        document.getElementById(`text${id}`).innerText = text + "(" + (xhr.loaded / 1024).toFixed(0) + " KB/" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById(`progress${id}`).style.width = (xhr.loaded / xhr.total * 100) + "%";
    }
}

export const Finish = {
    Skybox: () => {
        document.getElementById('text3').innerText = "天空盒加载完成.";
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
        // console.log(roledata)
        if (total != (2 + roledata['weapons'])) {
            total++;
            localStorage.setItem('onload', total);
            return;
        };
        gui();
        let from = other ? roledata['from'] : "神帝宇";
        let main = document.getElementById('main');
        let ok = document.getElementById('start');
        let h4 = document.createElement('h4');
        let br = document.createElement('br');
        ok.onclick = () => { document.getElementById('info').style.display = "none"; };
        document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
        document.getElementById('progress0').style.width = "100%";
        h4.innerHTML = `模型来源: ${from}`;
        main.appendChild(br);
        main.appendChild(h4);
        setTimeout(() => { document.getElementById('info').style.display = "none" }, 2000)
        console.log("Model:\n ID:" + id + " From:" + from + " Weapons:" + roledata['weapons']);
    },

    Model: (id1, id2, text) => {
        let info = (text === undefined) ? '' : text;
        document.getElementById(id1).innerText = info + "加载完成, 请等待材质下载.";
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
        [``,
            `模型来源: ${from}`,
            `动作来源: ${vmddata['from']}`,
            `背景音乐: ${vmddata['name']}`,
            `制作软件: three.js`,
        ].map((text) => {
            const h4 = document.createElement('h4');
            h4.innerHTML = text;
            main.appendChild(h4)
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
    document.getElementById('texte0').innerText = "Finish, please wait for the material.";
    document.getElementById('progress0').style.width = "100%";
    document.getElementById('VMDList').style.left = "0px";
    document.getElementById('three').style.top = "-60px";
    // if (roledata['name'] == '可可利亚BOSS') {
    //     document.getElementById('VMDList').innerHTML = null;
    // }
}

function Changelang(text) {
    document
}