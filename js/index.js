const langCfg = {
  zh: { data: null, data2: null, text: null },
  jp: { data: null, data2: null, text: null },
  en: { data: null, data2: null, text: null },
  ko: { data: null, data2: null, text: null },
  userSelect: null
};
let serverRoot, data, data2;
const Debug = isDebug();
const serverMap = ["//139.224.2.122", "//globe-res-sr.ycl.cool"]; // 可用服务器
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id


(async () => {
  const server = getUrlParams('server'); // 用户服务器选择处理
  serverRoot = serverMap[server] || (Debug ? "//127.0.0.1:8081" : null);
  if (!serverRoot) {
    const servers = await ServerChoose(serverMap, Debug);
    const serverID = chooseServer(servers);
    if (serverID === -1) /**错误处理**/;
    serverRoot = serverMap[serverID];
  }
  // 用户语言选择
  if (localStorage.userlang === undefined || !['zh', 'en', 'ko', 'jp'].includes(localStorage.userlang)) {
    // 默认中文
    langCfg.userSelect = "zh";
    localStorage.setItem('userlang', 'zh');
  } else {
    langCfg.userSelect = localStorage.userlang;
  }
  ChangeLang(langCfg.userSelect);
})();

async function ChangeLang(lang) {
  // 获取语言数据
  await Promise.all(['data', 'data2', 'text'].map(async (name) => {
    if (langCfg[lang][name] === null) {
      try {
        const response = await fetch(`${serverRoot}/lang/${lang}/${name}.json`);
        const json = await response.json();
        langCfg[lang][name] = json;
      } catch (error) { }
    }
  }));

  // 处理主表格
  if (data === undefined) {
    fetch(`${serverRoot}/data.json`)
      .then(response => response.json())
      .then(json => {
        data = json;
        WriteToTable(json, langCfg[lang].data, true)
        // 处理页脚
        document.getElementById('text8').innerHTML += `<a style="color:#3391ff">${data[0]['version']}</a>`;
        document.getElementById('text9').innerHTML += `<a style='color:#3391ff'>${data[0]['version2']}</a>`;
      })
      .catch(error => { /**错误处理**/ });
  } else {
    WriteToTable(data, langCfg[lang].data, true);
  }

  // 处理副表格
  if (data2 === undefined) {
    fetch(`${serverRoot}/data2.json`)
      .then(response => response.json())
      .then(json => {
        data2 = json;
        WriteToTable(json, langCfg[lang].data2, false);
      })
      .catch(error => { /**错误处理**/ });
  } else {
    WriteToTable(data2, langCfg[lang].data2, false);
  }

  // 处理文字翻译
  for (let i = 1; i <= 17; i++) {
    document.getElementById(`text${i}`).innerHTML = langCfg[lang]['text'][i];
  }
  ['tip', 'warn', 'error', 'note'].map((id) => {
    document.getElementsByClassName(id)[0].innerHTML = langCfg[lang]['text'][id];
  })
  if (data != undefined) { // 处理页脚
    document.getElementById('text8').innerHTML += `<a style="color:#3391ff">${data[0]['version']}</a>`;
    document.getElementById('text9').innerHTML += `<a style='color:#3391ff'>${data[0]['version2']}</a>`;
  }

  // 处理按钮视觉效果
  ['zh', 'en', 'ko', 'jp'].map((id) => {
    document.getElementById(id).dataset.selent = (id == lang) ? 1 : 0
  })
}

function WriteToTable(data, text, ismain) {
  // 生成未分类表格单元格
  if (!ismain) {
    const tbody = document.getElementById('unknow');
    if (tbody.dataset.gencell) {
      const cell_array = Array.from({ length: data[0]['total_line'] }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => (i + 1) * 10 + (j + 1))
      );
      cell_array.map((item) => {
        const tr = document.createElement('tr');
        item.map((id) => {
          const td = document.createElement('td');
          td.id = `table3-${id}`;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      })
    }
  }

  // 填表
  for (let i = 1; i <= data[0]['total']; i++) {
    const cellId = data[i]['data'].replace(',', '');
    const cell = document.getElementById(`table${ismain ? '' : '3'}-${cellId}`);
    const a = document.createElement('a');
    const note = document.createElement('a');
    const br = document.createElement('br');
    a.innerText = text[i].name;
    a.style.userSelect = "none";
    a.style.cursor = "pointer";
    note.classList = "note-mark";

    if (ismain) {
      a.onclick = e => {
        e.preventDefault();
        document.getElementsByClassName('overlay')[0].style.display = null;
        ShowPicture(i);
      };

      if (!data[i]['model']) {
        a.style.color = "aqua";
        note.innerText = "(2)";
        note.href = "#note3";
      } else if (nopic.includes(i)) {
        a.style.color = "greenyellow";
        note.innerText = "(1)";
        note.href = "#note2";
      }
    } else {
      a.style.textDecoration = "none";
      a.style.color = "#000";
      a.href = `3d.html?id=${i}&other=y`;
    }

    cell.appendChild(a);
    cell.appendChild(note);
    cell.appendChild(br);

    // 主表格续表
    if (ismain && cell.dataset.phone === '0') {
      const table2 = document.getElementById(`table2-${cellId}`);
      const a2 = a.cloneNode(true);
      const note2 = note.cloneNode(true);
      const br2 = br.cloneNode(true);
      a2.onclick = e => {
        e.preventDefault();
        document.getElementsByClassName('overlay')[0].style.display = null;
        ShowPicture(i);
      };
      table2.appendChild(a2);
      table2.appendChild(note2);
      table2.appendChild(br2)
    }
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

// 显示立绘
function ShowPicture(id) {
  if (id == -1) { // 关闭立绘展示
    document.getElementsByClassName('overlay')[0].style.display = 'none';
    document.getElementById('btn1').style.display = 'none';
    document.getElementById('nomodel').style.display = 'none';
    document.getElementById('img0').dataset.imgdata = 'no';
    document.getElementById('img1').style.display = 'none';
    return
  }
  const lang = langCfg.userSelect;
  const text = langCfg[lang]['text'];
  const data_text = langCfg[lang]['data'];
  document.getElementById('name').innerHTML = data_text[id]['name']; // 姓名
  // 属性和命途
  const parts = data[id]['data'].split(",");
  const [line, list] = [parts[0], parts[1]];
  document.getElementById('line').innerText = text.linedata[line - 1];
  document.getElementById('list').innerText = text.listdata[list - 1];
  document.getElementById('firstup').innerText = data[id]['firstup']; // 首次跃迁

  // 模型
  const btn0 = document.getElementById('btn0');
  const btn1 = document.getElementById('btn1');
  btn0.innerText = "查看(Show)";
  btn0.onclick = () => { location.href = `3d.html?id=${id}` };
  if (!data[id].model) {
    document.getElementById('nomodel').style.display = null;
    btn0.style.display = 'none';
    btn1.style.display = 'none';
  }
  if (data[id].special) {
    btn0.innerText = data_text[id].special[0];
    btn1.style.display = null;
    btn1.innerText = data_text[id].special[1];
    btn1.onclick = () => { location.href = `3d.html?id=${id}&${data[id]['special']}=1` };
  }

  // 图像
  const img0 = document.getElementById('img0');
  const img1 = document.getElementById('img1');
  img0.src = `${serverRoot}/img/character/${lang}/${id}.jpg`;
  if ([4, 45, 53, 65].includes(id)) {
    img0.dataset.imgdata = "two";
    img1.style.display = null;
    img1.src = `${serverRoot}/img/character/${lang}/${id}_isman.jpg`;
  } else if ([12, 17].includes(id)) {
    img0.dataset.imgdata = "center";
  } else {
    fetch(`${serverRoot}/img/character/${lang}/${id}.txt`, { method: 'HEAD' })
      .then(response => {
        if (response.ok) { img0.src = `${serverRoot}/img/character/zh/${id}.jpg` }
      })
      .catch(_ => { })
  }
}

function ChangeText(langCho) {
  // 清空表格
  const formcell = Array.from({ length: 8 }, (_, i) =>
    Array.from({ length: 7 }, (_, j) => (i + 1) * 10 + (j + 1))
  ).flat();
  formcell.map(id => {
    const maincell = document.getElementById(`table-${id}`);
    maincell.innerHTML = "";
    const phonecell = document.getElementById(`table2-${id}`);
    if (!phonecell) return;
    phonecell.innerHTML = "";
  });
  document.getElementById('unknow').innerHTML = "";
  // 保存语言数据并加载表格
  langCfg.userSelect = langCho;
  localStorage.setItem('userlang', langCho);
  ChangeLang(langCho);
}