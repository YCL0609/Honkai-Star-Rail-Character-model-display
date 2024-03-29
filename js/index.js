localStorage.onload = 0;
var nopic = [4, 12, 17, 45]; // 无介绍立绘id
// 人物属性 
var listdata = [null, "物理", "火", "冰", "雷", "风", "量子", "虚数"];
var linedata = [null, "毁灭", "巡猎", "智识", "同谐", "虚无", "存护", "丰饶"];

// 主表格
JsonToTable('data.json', 'table', true, 'table2');
// 未分类模型
(async () => {
  // 获取总行数
  var total_line = await ReadJson('data2.json', 0, 'total_line', false, false);
  for (let a = 1; a <= total_line; a++) {
    var table = document.getElementById('unknow');
    var tr = document.createElement('tr');
    tr.id = `table3-line${a}`;
    table.appendChild(tr);
    var tr_ = document.getElementById(`table3-line${a}`);
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
  JsonToTable('data2.json', 'table3', false);
})();

async function JsonToTable(file, tablename, main) {
  var data = await ReadJson(file, 0, 0, true);
  for (let i = 1; i <= data[0]['total']; i++) {
    let parts = data[i]['data'].split(",");
    let cell = document.getElementById(`${tablename}-${parts[0]}${parts[1]}`);
    let a = document.createElement('a');
    let note = document.createElement('a');
    let br = document.createElement('br');
    // 设置单元格内容
    a.innerText = data[i]['name'];
    note.classList = "note";
    a.style.userSelect = "none"
    a.style.cursor = "pointer"
    // 主表人物标记
    if (main) {
      // 跳转
      a.setAttribute('data-id', i);
      // 无模型
      if (!data[i]['model']) {
        a.style.color = "aqua";
        note.innerText = "(3)";
        note.href = "#note3";
      }
      // 无人物介绍立绘
      nopic.forEach(element => {
        if (i == element) {
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
  // 鼠标事件
  const click = document.querySelectorAll('[data-id]');
  click.forEach(e => {
    e.addEventListener('click', () => {
      const id = e.getAttribute('data-id');
      document.getElementById('picloading').style.display = null;
      Change('picture');
      ShowPicture(id);
    })
  });
  // 完成
  localStorage.onload++;
  if (localStorage.onload != 2) {
    return;
  }
  document.getElementById('loading').style.display = "none";
  document.getElementById('main').style.display = null;
}

async function ShowPicture(id) {
  var role = await ReadJson('data.json', id, '', false, true);
  // 姓名
  document.getElementById('name').innerHTML = role['name'];
  // 属性
  var parts = role['data'].split(",");
  var line = parts[0];
  var list = parts[1];
  // 命途
  document.getElementById('line').innerText = linedata[line];
  // 战斗属性
  document.getElementById('list').innerText = listdata[list];
  // 实装版本
  document.getElementById('firstup').innerText = role['firstup']
  // 模型
  var model = document.getElementById('showmodel');
  var btn = document.createElement('button');
  model.innerHTML = null;
  if (id == 4 || id == 45) { // 开拓者
    btn.innerText = "男主";
    btn.onclick = () => { window.location.href = "3d.html?id=4&isman=1" }
    model.appendChild(btn);
    var btn2 = document.createElement('button');
    btn2.innerText = "女主";
    btn2.onclick = () => { window.location.href = "3d.html?id=4" };
    model.appendChild(btn2);
  } else if (role['model']) {
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
    var btn2 = document.createElement('button');
    btn2.innerText = "白发";
    btn2.onclick = () => { window.location.href = "3d.html?id=46&iswhite=1" };
    model.appendChild(btn2);
  }
  // 立绘
  var picurl_root = role['urlroot'] ? "https://patchwiki.biligame.com/images/sr" : "https://upload-bbs.miyoushe.com/upload";
  document.getElementById('img1').src = picurl_root + role['picurl'];
  if (id == 4 || id == 45) { // 开拓者
    var download2 = document.createElement('button');
    var imgdiv = document.getElementById('imgdiv');
    var img2 = document.createElement('img');
    img2.id = "img2";
    img2.style.width = "48%";
    img2.src = "https://patchwiki.biligame.com/images/sr" + role['picurl2'];
    download2.innerText = "女主";
    download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank'); };
    document.getElementById('download').appendChild(download2);
    document.getElementById('btn').innerText = "男主";
    document.getElementById('img1').style.width = "48%";
    imgdiv.appendChild(img2);
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