let serverRoot, lang;
let data, data2, text;
let rolename, rolename2;
const Debug = isDebug();
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id
init();

async function init() {
  try {
    const server = getUrlParams('server'); // 用户服务器选择处理
    const serverMap = { 1: "//139.224.2.122", 2: "//globe-res-sr.ycl.cool" };
    serverRoot = serverMap[server] || (Debug ? "//127.0.0.1:8081" : null);
    if (!serverRoot) {
      try {
        const response = await fetch('?cf_iscn&' + RandomString(64), { method: 'HEAD' });
        serverRoot = response.headers.has('iscn') ? "//139.224.2.122" : "//globe-res-sr.ycl.cool";
      } catch (error) {
        document.getElementById('ServerChoose').style.display = null;
        document.getElementById('errorinfo').innerText = "Failed to initialize server:" + error.stack;
        serverRoot = "//globe-res-sr.ycl.cool"; // 默认服务器
      }
    }

    [data, data2, text] = await Promise.all([
      ReadJson(serverRoot + '/data.json', null, null, true),
      ReadJson(serverRoot + '/data2.json', null, null, true),
      ReadJson(serverRoot + '/lang/zh/text.json', null, null, true)
    ]);

    // 版本信息
    ['', '2'].forEach(e => {
      let a = document.createElement('a');
      a.innerText = data[0][`version${e}`];
      a.style.color = "#3391ff";
      document.getElementById(`ver${e}`).appendChild(a);
    });

    //默认中文
    lang = "zh";
    WriteTable('zh');
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
}

// 服务器筛选
function chooseServer(servers) {
  const validServers = servers.filter(s => !s.isError);
  if (validServers.length === 0) return -1;

  return servers.indexOf(validServers.reduce((fastest, current) =>
    current.elapsedTime < fastest.elapsedTime ? current : fastest
  ));
}


async function WriteTable(lang) {
  // 获取所选语言配置
  try {
    [rolename, rolename2] = await Promise.all([
      ReadJson(`${serverRoot}/lang/${lang}/data.json`, null, null, true),
      ReadJson(`${serverRoot}/lang/${lang}/data2.json`, null, null, true)
    ]);

    await Promise.all([
      JsonToTable(rolename, data, 'table', true, 'table2'),
      (async () => {
        const table = document.getElementById('unknow');
        if (!table) throw new Error("Table element not found");

        for (let a = 1; a <= data2[0]['total_line']; a++) {
          const tr = document.createElement('tr');
          tr.id = `table3-line${a}`;
          table.appendChild(tr);

          const tr_ = document.getElementById(`table3-line${a}`);
          if (!tr_) throw new Error(`Row with id table3-line${a} not found`);

          const td1 = document.createElement('td');
          const td2 = document.createElement('td');
          const td3 = document.createElement('td');
          td1.id = `table3-${a}1`;
          td2.id = `table3-${a}2`;
          td3.id = `table3-${a}3`;
          tr_.appendChild(td1);
          tr_.appendChild(td2);
          tr_.appendChild(td3);
        }
        JsonToTable(rolename2, data2, 'table3', false);
      })()
    ]);
  } catch (error) {
    console.error("Failed to write table:", error);
  }
}


function JsonToTable(name, data, tablename, main) {
  for (let i = 1; i <= data[0]['total']; i++) {
    const parts = data[i]['data'].split(",");
    const cell = document.getElementById(`${tablename}-${parts[0]}${parts[1]}`);
    const a = document.createElement('a');
    const note = document.createElement('a');
    const br = document.createElement('br');
    a.innerText = name[i]['name'];
    note.classList = "note";
    a.style.userSelect = "none";
    a.style.cursor = "pointer";
    if (main) {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('text21').style.display = null;
        ChangeCard('picture');
        ShowPicture(i);
      });
      if (!data[i]['model']) {
        a.style.color = "aqua";
        note.innerText = "(3)";
        note.href = "#note3";
      } else if (nopic.includes(i)) {
        a.style.color = "greenyellow";
        note.innerText = "(2)";
        note.href = "#note2";
      }
    } else {
      a.href = `3d.html?id=${i}&other`;
    }
    cell.appendChild(a);
    cell.appendChild(note);
    cell.appendChild(br);
  }
  // 手机
  if (isMobile()) {
    document.getElementById('moble-div').style.display = null;
    for (let i = 0; i <= 7; i++) {
      for (let e = 5; e <= 7; e++) {
        const td = document.getElementById(`table-${i}${e}`);
        const td2 = document.getElementById(`table2-${i}${e}`);
        td2.innerHTML = td.innerHTML;
        td.style.display = "none";
      }
    }
  }
}

function ShowPicture(id) {
  // 姓名
  document.getElementById('name').innerHTML = rolename[id]['name'];
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
    case 4:  // 开拓者 (物主)
    case 45: // 开拓者 (火主)
    case 53: // 开拓者 (同谐主)
    case 46: // 黄泉
      [{ text: rolename[id]['special'][0], href: `3d.html?id=${id}` },
      { text: rolename[id]['special'][1], href: `3d.html?id=${id}&${data[id]['special']}` }]
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
  document.getElementById('img1').src = `${serverRoot}/img/character/${lang}/${id}.jpg`;
  if ([4, 45, 53].includes(id)) { // 开拓者
    const download2 = document.createElement('button');
    let imgdiv = document.getElementById('imgdiv');
    const img2 = document.createElement('img');
    img2.id = "img2";
    img2.style.width = "48%";
    img2.src = `${serverRoot}/img/character/${lang}/${id}_isman.jpg`;
    download2.innerText = rolename[id]['special'][1];
    download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank'); };
    document.getElementById('download').appendChild(download2);
    document.getElementById('text20').innerText = rolename[id]['special'][0];
    document.getElementById('img1').style.width = "48%";
    imgdiv.appendChild(img2);
    document.getElementById('text12').onclick = () => { location.reload() }
  } else {
    fetch(`img/character/${lang}/${id}.txt`, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          document.getElementById('img1').src = `${serverRoot}/img/character/zh/${id}.jpg`;
        }
      })
  }
}

// 语言切换函数
function ChangeText(ChangeLang) {
  const warn = document.getElementsByClassName('warn')[0];
  const bar = document.getElementById('bar');
  Promise.all([
    new Promise(() => { // 按钮样式
      ['zh', 'en', 'jp', 'ko'].forEach(e => {
        document.getElementById(e).style = null;
      });
      document.getElementById(ChangeLang).style.border = "solid #0069d2";
    }),
    new Promise(() => { // 提示信息
      const text = ReadJson(`lang/${ChangeLang}/text.json`, null, null, true)
      lang = ChangeLang;
      document.getElementById('warn').innerText = text.warn;
      document.getElementsByClassName('tip-txt')[0].innerHTML = text.tip;
      warn.style.display = (ChangeLang === 'zh') ? "none" : null
      let isko = (ChangeLang === 'ko');
      warn.style.backgroundColor = isko ? "#ff000035" : "#ffff0035";
      bar.style.backgroundColor = isko ? "red" : "yellow";
      for (let i = 0; i <= 21; i++) {
        document.getElementById(`text${i}`).innerHTML = text[i];
      }
    }),
    new Promise(() => {
      fetch(`lang/${lang}/note.html`) // 注释
        .then(response => response.text())
        .then(text => { document.getElementsByClassName('note-div')[0].innerHTML = text })
    }),
    new Promise(() => { // 表格
      [[11, 17], [21, 27], [31, 37], [41, 47], [51, 57], [61, 67], [71, 77]]
        .forEach(([start, end]) => {
          for (let i = start; i <= end; i++) {
            document.getElementById(`table-${i}`).innerHTML = null;
          }
        });
      if (isMobile()) {
        [[15, 17], [25, 27], [35, 37], [45, 47], [55, 57], [65, 67], [75, 77]]
          .forEach(([start, end]) => {
            for (let i = start; i <= end; i++) {
              document.getElementById(`table2-${i}`).innerHTML = null;
            }
          });
      }
      document.getElementById('unknow').innerHTML = null;
      WriteTable(ChangeLang);
    })
  ])
}

function ChangeCard(card) {
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