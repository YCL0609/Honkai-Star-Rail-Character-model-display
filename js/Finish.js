import { roledata, other, vmd, id } from './3d.js';

// 背景加载
export function BGFinish() {
    if (!vmd) {
        AutoFinish();
    } else {
        MMDFinish();
    }
}

// 正常加载
export function AutoFinish() {
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
    console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + from + " Weapons:" + roledata['weapons']);
    main.appendChild(br);
    main.appendChild(h4);
    setTimeout(() => {
        document.getElementById('info').style.display = "none"
    },2500)
}

// MMD加载
export async function MMDFinish() {
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
    // document.getElementById('main-h4').style = null;
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