import { roledata, other, vmd, id, } from './3d.js';

// 背景加载
export function BGFinish() {
  if (!vmd) {
    AutoFinish()
  } else {
    MMDFinish()
  }
}

// 正常加载
export function AutoFinish() {
  var total = localStorage.onload;
  if (total != (2 + roledata['weapons'])) {
    total++;
    localStorage.setItem('onload', total);
    return;
  }
  // 完成所有加载
  var main = document.getElementById('main');
  var hr = document.createElement('hr');
  main.appendChild(hr);
  document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
  document.getElementById('progress0').style.width = "100%";
  if (!other) {
    // 官方模型
    var from = "神帝宇";
    var mmd = true;
    var text = null;
  } else {
    // 非官方模型
    var from = roledata['from'];
    var mmd = roledata['mmd'];
    var text = roledata['other'];
  }
  var h4 = document.createElement('h4');
  console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + from);
  h4.innerHTML = `模型来源: ${from}`;
  h4.style.marginLeft = "0px";
  h4.style.textAlign = "center";
  main.appendChild(h4);
  if (text !== null) {
    var h4_2 = document.createElement('h4');
    h4_2.innerHTML = `<em>${text}</em>`;
    h4_2.style.marginLeft = "0px";
    h4_2.style.textAlign = "center";
    main.appendChild(document.createElement('br'));
    main.appendChild(h4_2);
  }
  var ok = document.getElementById('start')
  ok.style = null;
  ok.innerText = "关闭";
  ok.onclick = () => { document.getElementById('info').style.display = "none"; };
  setTimeout(() => {
    if (mmd) {
      document.getElementById('VMDList').style.left = "0px";
    }
    document.getElementById('three').style.top = "-20px";
  }, 1500);
}

// MMD加载
export async function MMDFinish() {
  var vmddata = await ReadJson('vmd/data.json', vmd, 0, false, true)
  var total = localStorage.onload;
  // var bg = localStorage.onload_bg;
  if (total != 3) {
    total++;
    localStorage.setItem('onload', total);
    return;
  }
  document.getElementById('VMDList').style.left = "0px";
  document.getElementById('start').style = null;
  var main = document.getElementById('main');
  var hr = document.createElement('hr');
  main.appendChild(hr);
  document.getElementById('text0').innerText = "加载完成, 请等待材质下载.";
  document.getElementById('progress0').style.width = "100%";
  document.getElementById('main-h4').style = null;
  if (!other) {
    // 官方模型
    var name = "神帝宇";
  } else {
    // 非官方模型
    var name = roledata['from'];
  }
  var h4_0 = document.createElement('h4');
  var h4_1 = document.createElement('h4');
  var h4_2 = document.createElement('h4');
  var h4_3 = document.createElement('h4');
  console.log("Model:\n ID:" + id + " Name:" + name + " From:" + roledata['from'] + "\nAnimation:\n ID:" + vmd + " Name:" + vmddata['name'] + " From:" + vmddata['from']);
  h4_0.innerHTML = `模型来源: ${name}`;
  h4_1.innerHTML = `动作来源: ${vmddata['from']}`
  h4_2.innerHTML = `背景音乐: ${vmddata['name']}`
  h4_3.innerHTML = `制作软件: three.js`
  main.appendChild(h4_0);
  main.appendChild(h4_1);
  main.appendChild(h4_2);
  main.appendChild(h4_3);
  setTimeout(() => {
    document.getElementById('VMDList').style.left = "0px";
    document.getElementById('three').style.top = "-20px";
  }, 1500);
}

