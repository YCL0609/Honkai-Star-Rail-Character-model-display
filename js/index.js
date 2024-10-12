let serverRoot, lang;
let data, data2, text;
let rolename, rolename2;
const Debug = isDebug();
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id

(async function() {
  try {
    await init();
    console.log(serverRoot);
    console.log([data, data2, text]);
  } catch (error) {
    console.error("Initialization failed:", error);
  }
})();

async function init() {
  const server = getUrlParams('server'); // 用户服务器选择处理
  const serverMap = ["//139.224.2.122", "//globe-res-sr.ycl.cool"];
  serverRoot = serverMap[server] || (Debug ? "//127.0.0.1:8081" : null);

  if (!serverRoot) {
    const servers = await ServerChoose(serverMap, Debug);
    const serverID = chooseServer(servers);
    if (serverID === -1) throw new Error("No valid server available");
    serverRoot = serverMap[serverID];
  }

  [data, data2, text] = await Promise.all([
    ReadJson(serverRoot + '/data.json', null, null, true),
    ReadJson(serverRoot + '/data2.json', null, null, true),
    ReadJson(serverRoot + '/lang/zh/text.json', null, null, true)
  ]);

  // 版本信息
  ['', '2'].forEach(e => {
    const a = document.createElement('a');
    a.innerText = data[0][`version${e}`];
    a.style.color = "#3391ff";
    document.getElementById(`ver${e}`).appendChild(a);
  });

  // 默认中文
  lang = "zh";
  await WriteTable('zh');
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

          const [td1, td2, td3] = [1, 2, 3].map(i => {
            const td = document.createElement('td');
            td.id = `table3-${a}${i}`;
            return td;
          });

          tr_.append(td1, td2, td3);
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
    if (!cell) continue;

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
      a.href = `3d.html?id=${i}&other=y`;
    }

    cell.append(a, note, br);
  }

  // 手机
  if (isMobile()) {
    document.getElementById('moble-div').style.display = null;
    for (let i = 0; i <= 7; i++) {
      for (let e = 5; e <= 7; e++) {
        const td = document.getElementById(`table-${i}${e}`);
        const td2 = document.getElementById(`table2-${i}${e}`);
        if (td && td2) {
          td2.innerHTML = td.innerHTML;
          td.style.display = "none";
        }
      }
    }
  }
}

function ShowPicture(id) {
  try {
    document.getElementById('name').innerHTML = rolename[id]['name'];
    const parts = data[id]['data'].split(",");
    const [line, list] = [parts[0], parts[1]];
    document.getElementById('line').innerText = text['linedata'][line - 1]; // 命途
    document.getElementById('list').innerText = text['listdata'][list - 1]; // 战斗属性
    document.getElementById('firstup').innerText = data[id]['firstup'];

    const model = document.getElementById('showmodel');
    model.innerHTML = '';

    const createButton = (text, href) => {
      const btn = document.createElement('button');
      btn.innerText = text;
      btn.onclick = () => { window.location.href = href };
      model.appendChild(btn);
    };

    switch (id) {
      case 4:
      case 45:
      case 53:
      case 46:
        rolename[id]['special'].forEach(cfg => createButton(cfg.text, `3d.html?id=${id}&${data[id]['special']}`));
        break;
      default:
        if (data[id]['model']) {
          createButton(text['model'][0], `3d.html?id=${id}`);
        } else {
          model.innerHTML = `<a style='color:red'>${text['model'][1]}</a>`;
        }
        break;
    }

    document.getElementById('img1').src = `${serverRoot}/img/character/${lang}/${id}.jpg`;

    if ([4, 45, 53].includes(id)) {
      const img2 = document.createElement('img');
      img2.id = "img2";
      img2.style.width = "48%";
      img2.src = `${serverRoot}/img/character/${lang}/${id}_isman.jpg`;
      document.getElementById('imgdiv').appendChild(img2);
      document.getElementById('img1').style.width = "48%";
      document.getElementById('text20').innerText = rolename[id]['special'][0];
      document.getElementById('text12').onclick = () => { location.reload() };
    } else {
      fetch(`img/character/${lang}/${id}.txt`, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            document.getElementById('img1').src = `${serverRoot}/img/character/zh/${id}.jpg`;
          }
        });
    }
  } catch (error) {
    console.error("Failed to show picture:", error);
  }
}

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
      const text = ReadJson(`${serverRoot}/lang/${ChangeLang}/text.json`, null, null, true);
      lang = ChangeLang;
      document.getElementById('warn').innerText = text.warn;
      document.getElementsByClassName('tip-txt')[0].innerHTML = text.tip;
      warn.style.display = (ChangeLang === 'zh') ? "none" : null;
      const isko = (ChangeLang === 'ko');
      warn.style.backgroundColor = isko ? "#ff000035" : "#ffff0035";
      bar.style.backgroundColor = isko ? "red" : "yellow";
      for (let i = 0; i <= 21; i++) {
        document.getElementById(`text${i}`).innerHTML = text[i];
      }
    }),
    new Promise(() => {
      fetch(`${serverRoot}/lang/${lang}/note.html`) // 注释
        .then(response => response.text())
        .then(text => { document.getElementsByClassName('note-div')[0].innerHTML = text })
    }),
    new Promise(() => { // 表格
      const ranges = [[11, 17], [21, 27], [31, 37], [41, 47], [51, 57], [61, 67], [71, 77]];
      ranges.forEach(([start, end]) => {
        for (let i = start; i <= end; i++) {
          document.getElementById(`table-${i}`).innerHTML = null;
        }
      });
      if (isMobile()) {
        const mobileRanges = [[15, 17], [25, 27], [35, 37], [45, 47], [55, 57], [65, 67], [75, 77]];
        mobileRanges.forEach(([start, end]) => {
          for (let i = start; i <= end; i++) {
            document.getElementById(`table2-${i}`).innerHTML = null;
          }
        });
      }
      document.getElementById('unknow').innerHTML = null;
      WriteTable(ChangeLang);
    })
  ]);
}

function ChangeCard(card) {
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
