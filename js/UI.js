import * as THREE from 'three';
import { dataurl, roledata, other, vmd, id } from './3d.js';

export async function Init() {
    localStorage.setItem('onload', 0);
    localStorage.setItem('onload_bg', 0);
    Progress.main(2);
    document.getElementById('skybox').style.display = null;
    document.getElementById('module').style = null;
    document.getElementById('background').style = null;
    console.log('three.js version: ' + THREE.REVISION);
    let total = await ReadJson(dataurl, 0, 'total');
    const tmp = parseInt(id);
    if (isNaN(tmp) || tmp < 1 || tmp > total) { Error(1) }
    const tmp2 = parseInt(vmd);
    if (isNaN(tmp2) || tmp2 < 1 || tmp2 > 3) { Error(2) }
}

export function Error(code, error) {
    const Info = [];
    Info[0] = "UI初始化错误";
    Info[1] = "URL参数错误: 参数'id'不是数字或在可接受范围外";
    Info[2] = "URL参数错误: 参数'vmd'不是数字或在可接受范围外";
    Info[3] = "three.js初始化错误";
    console.error(Info[code] + error);
    // Poop()
    /********!!!!!!unfinish!!!!*****/
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
    Weapon: () => {
        let info = document.createElement('div');
        info.id = `weapon${i}`;
        info.innerHTML = `<h4>武器模型${i}:<a id="text-w${i}" class="text"></a></h4>
        <div class="progress">
          <div id="progress-w${i}" class="progress-inside" style="width: 0%"></div>
        </div>`;
        document.getElementById('info-main').appendChild(info);
    }
    /*******!!!unfinish!!!*********/
}

export const Progress = {
    main: num => {
        let info = [];
        info[2] = "初始化加载器..."
        info[3] = "等待响应..."
        document.getElementById('text0').innerText = `(${num}/4)${info[num]}`;
        document.getElementById('progress0').style.width = `${num * 25}%`;
    },
    mainmod: xhr => {
        document.getElementById('text1').innerText = "主模型:" + "(" + (xhr.loaded / 1024).toFixed(0) + " KB/" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById('progress1').style.width = (xhr.loaded / xhr.total * 100) + "%";
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

    Auto: () => {
        var total = localStorage.onload;
        if (total != (2 + roledata['weapons'])) {
            total++;
            localStorage.setItem('onload', total);
            return;
        }; gui();
        var from = other ? roledata['from'] : "神帝宇";
        var main = document.getElementById('main');
        var ok = document.getElementById('start');
        var h4 = document.createElement('h4');
        var br = document.createElement('br');
        ok.onclick = () => { document.getElementById('info').style.display = "none"; };
        document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
        document.getElementById('progress0').style.width = "100%";
        h4.innerHTML = `模型来源: ${from}`;
        main.appendChild(br);
        main.appendChild(h4);
        setTimeout(() => { document.getElementById('info').style.display = "none", 2500 })
        console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + from + " Weapons:" + roledata['weapons']);
    },

    Weapon: id => {
        document.getElementById(`text-w${id}`).innerText = "加载完成, 请等待材质下载.";
        setTimeout(() => {
            document.getElementById(`weapon${id}`).style.display = "none";
            Finish.Auto();
        }, 2000);
    },

    MMD: async () => {
        var vmddata = await ReadJson('vmd/data.json', vmd, 0, false, true);
        var total = localStorage.onload;
        if (total != 3) {
            total++;
            localStorage.setItem('onload', total);
            return;
        }; gui();
        var from = other ? roledata['from'] : "神帝宇";
        var main = document.getElementById('main');
        var h4_0 = document.createElement('h4');
        var h4_1 = document.createElement('h4');
        var h4_2 = document.createElement('h4');
        var h4_3 = document.createElement('h4');
        var br = document.createElement('br');
        document.getElementById('start').style = null;
        h4_0.innerHTML = `<br>模型来源: ${from}`;
        h4_1.innerHTML = `动作来源: ${vmddata['from']}`;
        h4_2.innerHTML = `背景音乐: ${vmddata['name']}`;
        h4_3.innerHTML = `制作软件: three.js`;
        main.appendChild(br);
        main.appendChild(h4_0);
        main.appendChild(h4_1);
        main.appendChild(h4_2);
        main.appendChild(h4_3);
        console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + from + "\nAnimation:\n ID:" + vmd + " Name:" + vmddata['name'] + " From:" + vmddata['from']);
    }
}

function gui() {
    var title = document.getElementsByClassName('title');
    for (let i = 0; i < title.length; i++) {
        title[i].click();
    }
    document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
    document.getElementById('progress0').style.width = "100%";
    document.getElementById('VMDList').style.left = "0px";
    document.getElementById('three').style.top = "-60px";
    if (roledata['name'] == '可可利亚BOSS') {
        document.getElementById('VMDList').innerHTML = null;
    }
}

function Poop(color, text, time) {
    const PoopDiv = document.createElement('div');
    PoopDiv.classList = "poop";
    PoopDiv.style.backgroundColor = color;
    PoopDiv.innerText = "错误: " + text;
    document.body.append(PoopDiv)
    setTimeout(() => {
        PoopDiv.style.top = "-100px"
    }, time * 1000)
}