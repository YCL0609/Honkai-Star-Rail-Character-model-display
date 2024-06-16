const data2 = await ReadJson('data2.json', null, null, true);
const data = await ReadJson('data.json', null, null, true);
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id
let onload = 0;

// 默认中文
const text = await ReadJson(`lang/zh/text.json`, null, null, true);
localStorage.setItem('text', JSON.stringify(text));
WriteTable('zh');

async function WriteTable(lang) {
  // 获取所选语言配置
  const name = await ReadJson(`lang/${lang}/data.json`, null, null, true);
  const name2 = await ReadJson(`lang/${lang}/data2.json`, null, null, true);
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
        ChangeCard('picture');
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
      a.href = `3d.html?id=${i}&other`;
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
        td2.innerHTML = td.innerHTML;
        td.style.display = "none"
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

function ShowPicture(id) {
  const text = JSON.parse(localStorage.text);
  const name = JSON.parse(localStorage.name);
  // 姓名
  document.getElementById('name').innerHTML = name[id]['name'];
  // 属性
  let parts = data[id]['data'].split(",");
  let line = parts[0];
  let list = parts[1];
  document.getElementById('line').innerText = text['linedata'][line - 1]; // 命途
  document.getElementById('list').innerText = text['listdata'][list - 1]; // 战斗属性
  // 实装版本
  document.getElementById('firstup').innerText = data[id]['firstup'];
  // 模型
  let model = document.getElementById('showmodel');
  model.innerHTML = null;
  switch (id) {
    case 4: // 开拓者
    case 45:
    case 53:
    case 46: // 黄泉
      [{ text: name[id]['special'][0], href: `3d.html?id=${id}` },
      { text: name[id]['special'][1], href: `3d.html?id=${id}&${data[id]['special']}` }]
        .forEach(cfg => {
          const btn = document.createElement('button');
          btn.innerText = cfg.text;
          btn.onclick = () => { window.location.href = cfg.href };
          model.appendChild(btn);
        });
      break;
    default:
      if (data[id]['model']) { // 正常
        const btn = document.createElement('button');
        btn.innerText = text['model'][0];
        btn.onclick = () => { window.location.href = `3d.html?id=${id}` };
        model.appendChild(btn);
      } else { // 无模型
        model.innerHTML = `<a style='color:red'>${text['model'][1]}</a>`;
      }
      break;
  }
  // 立绘
  let picurl_root = name[id]['urlroot'] ? name[0]['urlroot1'] : name[0]['urlroot2']; // 判断立绘图片的所属域名前缀
  document.getElementById('img1').src = picurl_root + name[id]['picurl'];
  if ([4, 45, 53].includes(id)) { // 开拓者
    let download2 = document.createElement('button');
    let imgdiv = document.getElementById('imgdiv');
    let img2 = document.createElement('img');
    img2.id = "img2";
    img2.style.width = "48%";
    img2.src = "https://patchwiki.biligame.com/images/sr" + name[id]['picurl2'];
    download2.innerText = name[id]['special'][0];
    download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank'); };
    document.getElementById('download').appendChild(download2);
    document.getElementById('text20').innerText = name[id]['special'][1];
    document.getElementById('img1').style.width = "48%";
    imgdiv.appendChild(img2);
    document.getElementById('text12').onclick = () => { location.reload() }
  }
}

// 语言切换函数
window.ChangeText = async (lang) => {
  let divid = ['zh', 'en', 'jp', 'ko']
  divid.map((e) => {
    let div = document.getElementById(e)
    div.style.border = 0;
    div.style.pointerEvents = "none";
  })
  let warn = document.getElementsByClassName('warn')[0];
  let bar = document.getElementById('bar');
  let text = await ReadJson(`lang/${lang}/text.json`, null, null, true);
  localStorage.setItem('text', JSON.stringify(text));
  localStorage.setItem('lang', lang);
  document.getElementById('warn').innerText = text['warn'];
  document.getElementsByClassName('tip-txt')[0].innerHTML = text['tip'];
  if (lang === 'zh') {
    warn.style.display = 'none'
  } else {
    warn.style.display = null
  }
  if (lang === 'ko') {
    warn.style.backgroundColor = "#ff000035";
    bar.style.backgroundColor = "red";
  } else {
    warn.style.backgroundColor = "#ffff0035";
    bar.style.backgroundColor = "yellow";
  }
  // 更换UI语言
  for (let i = 0; i <= 21; i++) {
    document.getElementById(`text${i}`).innerHTML = text[i];
  }
  // 更换注释语言
  fetch(`lang/${lang}/note.html`)
    .then(response => response.text())
    .then(text => {
      document.getElementsByClassName('note-div')[0].innerHTML = text;
    });
  // 清除表格
  [[11, 17], [21, 27], [31, 37], [41, 47], [51, 57], [61, 67], [71, 77]]
    .map(([start, end]) => {
      for (let i = start; i <= end; i++) {
        document.getElementById(`table-${i}`).innerHTML = null;
      }
    });
  if (isMobile()) {
    [[15, 17], [25, 27], [35, 37], [45, 47], [55, 57], [65, 67], [75, 77]]
      .map(([start, end]) => {
        for (let i = start; i <= end; i++) {
          document.getElementById(`table2-${i}`).innerHTML = null;
        }
      });
  }
  document.getElementById('unknow').innerHTML = null;
  WriteTable(lang); // 填入表格
  divid.map((e) => { document.getElementById(e).style = null })
  document.getElementById(lang).style.border = "solid #0069d2"
}

window.ChangeCard = (card) => {
  const main = document.getElementById('main');
  const picture = document.getElementById('picture');
  if (card === "picture") {
    main.style.display = "none";
    picture.style.display = null
  } else if (card === "main") {
    picture.style.display = "none";
    main.style.display = null
  }
}