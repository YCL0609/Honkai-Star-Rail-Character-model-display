(async () => {
  const cfg = JSON.stringify(await ReadJson('data.json', null, null, true));
  const cfg2 = JSON.stringify(await ReadJson('data2.json', null, null, true));
  localStorage.setItem('data', cfg);
  localStorage.setItem('data2', cfg2);
})();
let onload = 0;
let lang = "zh";
// const data = JSON.parse(localStorage.data);
// const data2 = JSON.parse(localStorage.data2);
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id

WriteTable();

async function WriteTable() {
  const data = JSON.parse(localStorage.data);
  const data2 = JSON.parse(localStorage.data2);
  // 获取所选语言配置
  const name = await ReadJson(`lang/${lang}/data.json`, null, null, true);
  const name2 = await ReadJson(`lang/${lang}/data2.json`, null, null, true);
  const cfg = JSON.stringify(await ReadJson(`lang/${lang}/text.json`, null, null, true))
  localStorage.setItem('text', cfg);
  localStorage.setItem('name', JSON.stringify(name));
  // 主表格
  JsonToTable(name, data, 'table', true, 'table2');
  // 附表格
  for (let a = 1; a <= data2[0]['total_line']; a++) {
    let table = document.getElementById('unknow');
    let tr = document.createElement('tr');
    tr.id = `table3-line${a}`;
    table.appendChild(tr);
    let tr_ = document.getElementById(`table3-line${a}`);
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    td1.id = `table3-${a}1`;
    td2.id = `table3-${a}2`;
    td3.id = `table3-${a}3`;
    tr_.appendChild(td1);
    tr_.appendChild(td2);
    tr_.appendChild(td3);
  }
  // 填入数据
  JsonToTable(name2, data2, 'table3', false);
}

function JsonToTable(name, data, tablename, main) {
  for (let i = 1; i <= data[0]['total']; i++) {
    let parts = data[i]['data'].split(","); // 获取表格位置
    let cell = document.getElementById(`${tablename}-${parts[0]}${parts[1]}`);
    let a = document.createElement('a');
    let note = document.createElement('a');
    let br = document.createElement('br');
    // 设置单元格内容
    a.innerText = name[i]['name'];
    note.classList = "note";
    a.style.userSelect = "none"
    a.style.cursor = "pointer"
    // 主表人物标记
    if (main) {
      // 跳转
      a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('text21').style.display = null;
        Change('picture');
        ShowPicture(i);
      })
      // 无模型
      if (!data[i]['model']) {
        a.style.color = "aqua";
        note.innerText = "(3)";
        note.href = "#note3";
      }
      // 无人物介绍立绘
      nopic.forEach(e => {
        if (i === e) {
          a.style.color = "greenyellow";
          note.innerText = "(2)";
          note.href = "#note2";
        }
      });
    } else {
      a.href = `3d.html?id=${i}&other=1`;
    }
    // 添加到页面
    cell.appendChild(a);
    cell.appendChild(note);
    cell.appendChild(br);
  }
  // 手机
  if (isMobile()) {
    document.getElementById('moble-div').style.display = null;
    for (let i = 0; i <= 7; i++) {
      for (let e = 5; e <= 7; e++) {
        let td = document.getElementById(`table-${i}${e}`);
        let td2 = document.getElementById(`table2-${i}${e}`);
        td.style.display = "none";
        td2.innerHTML = td.innerHTML
      }
    }
  }

  // 完成
  onload++;
  if (onload != 2) {
    return;
  }
  document.getElementById('loading').style.display = "none";
  document.getElementById('main').style.display = null;
}

async function ShowPicture(id) {
  const data = JSON.parse(localStorage.data);
  // const data2 = JSON.parse(localStorage.data2);
  const linedata = JSON.parse(localStorage.text)['linedata'];
  const listdata = JSON.parse(localStorage.text)['listdata'];
  const name = JSON.parse(localStorage.name);
  // 姓名
  document.getElementById('name').innerHTML = name[id]['name'];
  // 属性
  let parts = data[id]['data'].split(",");
  let line = parts[0];
  let list = parts[1];
  // 命途
  document.getElementById('line').innerText = linedata[line - 1];
  // 战斗属性
  document.getElementById('list').innerText = listdata[list - 1];
  // 实装版本
  document.getElementById('firstup').innerText = data[id]['firstup']
  // 模型
  let model = document.getElementById('showmodel');
  let btn = document.createElement('button');
  model.innerHTML = null;
  if (id == 4 || id == 45 || id == 53) { // 开拓者
    btn.innerText = "男主";
    btn.onclick = () => { window.location.href = "3d.html?id=4&isman=1" }
    model.appendChild(btn);
    let btn2 = document.createElement('button');
    btn2.innerText = "女主";
    btn2.onclick = () => { window.location.href = "3d.html?id=4" };
    model.appendChild(btn2);
  } else if (data[id]['model']) {
    btn.innerText = "查看";
    btn.onclick = () => { window.location.href = "3d.html?id=" + id };
    model.appendChild(btn);
  } else {
    model.innerHTML = "<a style='color:red'>暂缺</a>";
  }
  if (id == 46) { // 黄泉
    btn.innerText = "正常";
    btn.onclick = () => { window.location.href = "3d.html?id=46" }
    model.appendChild(btn);
    let btn2 = document.createElement('button');
    btn2.innerText = "白发";
    btn2.onclick = () => { window.location.href = "3d.html?id=46&iswhite=1" };
    model.appendChild(btn2);
  }
  // 立绘
  let picurl_root = name[id]['urlroot'] ? "https://patchwiki.biligame.com/images/sr" : "https://upload-bbs.miyoushe.com/upload";
  document.getElementById('img1').src = picurl_root + name[id]['picurl'];
  if (id == 4 || id == 45 || id == 53) { // 开拓者
    let download2 = document.createElement('button');
    let imgdiv = document.getElementById('imgdiv');
    let img2 = document.createElement('img');
    img2.id = "img2";
    img2.style.width = "48%";
    img2.src = "https://patchwiki.biligame.com/images/sr" + name[id]['picurl2'];
    download2.innerText = "女主";
    download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank'); };
    document.getElementById('download').appendChild(download2);
    document.getElementById('text20').innerText = "男主";
    document.getElementById('img1').style.width = "48%";
    imgdiv.appendChild(img2);
    console.log(img2)
    console.log(imgdiv)
    document.getElementById('back').onclick = () => { location.reload() }
  }
}

function Change(card) {
  const main = document.getElementById('main');
  const picture = document.getElementById('picture');
  if (card === "picture") {
    main.style.display = "none";
    picture.style.display = null;
  } else if (card === "main") {
    picture.style.display = "none";
    main.style.display = null;
  }
}

async function ChangeText(lang) {
  let warn = document.getElementById('warn')
  let text = await ReadJson(`lang/${lang}/text.json`, null, null, true);
  console.log(text['listdata'])
  warn.innerText = text['warn'];
  if (lang === 'zh') {
    document.getElementsByClassName('warn')[0].style.display = 'none'
  } else {
    document.getElementsByClassName('warn')[0].style.display = null
  }
  if (lang === 'ko') {
    document.getElementsByClassName('warn')[0].style.backgroundColor = "#ff000035";
    document.getElementById('bar').style.backgroundColor = "red";
  } else {
    document.getElementsByClassName('warn')[0].style.backgroundColor = "#ffff0035";
    document.getElementById('bar').style.backgroundColor = "yellow";
  }
  for (let i = 0; i <= 21; i++) {
    document.getElementById(`text${i}`).innerHTML = text[i];
  }
  fetch(`lang/${lang}/note.html`)
    .then(response => response.text())
    .then(text => {
      document.getElementsByClassName('note-div')[0].innerHTML = text;
    });
}


console.log(`



+-----------------------------+
|  当前为测试版本可能会出bug!  |
+-----------------------------+



`)