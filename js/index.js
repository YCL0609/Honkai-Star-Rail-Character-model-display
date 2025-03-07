const langCfg = {
  zh: { data: null, data2: null, text: null, errInfo: "页面脚本运行错误! 若频繁出现请进行反馈." },
  jp: { data: null, data2: null, text: null, errInfo: "ページスクリプトの実行エラーです！頻繁に発生する場合はフィードバックをお願いします。" },
  en: { data: null, data2: null, text: null, errInfo: "Page script running error! If it occurs frequently, please give feedback." },
  ko: { data: null, data2: null, text: null, errInfo: "페이지 스크립트 실행 오류! 자주 발생하는 경우 피드백을 제공하십시오." },
  allLang: ['zh', 'en', 'ko', 'jp'],
  userSelect: null
};
let serverRoot, data, data2;
const Debug = isDebug();
let DebugID = "100";
const serverMap = ["//139.224.2.122", "//server1.ycl.cool/srroot", "//server0.ycl.cool/srroot"]; // 可用服务器
const nopic = [4, 12, 17, 45, 53]; // 无介绍立绘id

if (Debug) { // 调试初始化
  const id = getUrlParams('debug');
  if (!isNaN(id)) DebugID = id.padEnd(3, 0);
  console.log(`调试ID: %c${id}`, 'color: #0ff');
  /**
   * 是否进行服务器连接测试
   * 是否打印到控制台
   * 是否使用本地资源文件
   **/
}

(async () => {
  // 用户语言选择
  if (localStorage.userlang === undefined || !langCfg.allLang.includes(localStorage.userlang)) {
    // 默认中文
    langCfg.userSelect = "zh";
    localStorage.setItem('userlang', 'zh');
  } else {
    langCfg.userSelect = localStorage.userlang;
  }
  // 服务器选择
  if (Number(DebugID[0])) {
    const servers = await ServerChoose(serverMap, Number(DebugID[1]));
    const serverID = chooseServer(servers);
    if (serverID === -1) {
      document.getElementsByClassName('server')[0].style.display = "block";
      InError(1, '所有服务器无法连接或响应超时');
    }
    serverRoot = Number(DebugID[2]) ? "//127.0.0.1:8081" : serverMap[serverID];
  } else {
    serverRoot = "//127.0.0.1:8081"
  }
  ChangeLang(langCfg.userSelect);
})();

// 服务器筛选
function chooseServer(servers) {
  const validServers = servers.filter(s => !s.isError);
  if (validServers.length === 0) return -1;

  return servers.indexOf(validServers.reduce((fastest, current) =>
    current.elapsedTime < fastest.elapsedTime ? current : fastest
  ));
}

// 语言切换
async function ChangeLang(lang) {
  // 保存语言数据
  langCfg.userSelect = lang;
  localStorage.setItem('userlang', lang);
  if (DebugID) console.log(`语言切换为 ${lang}`);

  // 清空表格
  try {
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
  } catch (error) { InError(0, error.stack) }

  // 获取语言数据
  await Promise.all(['data', 'data2', 'text'].map(async (name) => {
    if (langCfg[lang][name] === null) {
      try {
        const response = await fetch(`${serverRoot}/lang/${lang}/${name}.json`);
        const json = await response.json();
        langCfg[lang][name] = json;
      } catch (error) { InError(3, `${name}.json文件获取失败:\n  ` + error.stack) }
    }
  }))

  // 处理主表格
  if (data === undefined) {
    fetch(`${serverRoot}/data.json`)
      .then(response => response.json())
      .then(json => {
        data = json;
        WriteToTable(json, langCfg[lang].data, true);
        // 处理页脚
        document.getElementById('ver0').innerHTML = data[0]['version'];
        document.getElementById('ver1').innerHTML = data[0]['version2'];
      })
      .catch(error => InError(4, `data.json文件获取失败:\n  ` + error.stack));
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
      .catch(error => InError(4, `data2.json文件获取失败:\n  ` + error.stack));
  } else {
    WriteToTable(data2, langCfg[lang].data2, false);
  }

  // 处理文字翻译
  try {
    for (let i = 1; i <= 17; i++) {
      document.getElementById(`text${i}`).innerHTML = langCfg[lang]['text'][i];
    }
    ['tip', 'warn', 'error', 'note'].map((id) => {
      document.getElementsByClassName(id)[0].innerHTML = langCfg[lang]['text'][id];
    })
  } catch (error) { InError(0, error.stack) }

  // 处理按钮视觉效果
  langCfg.allLang.map((id) => {
    document.getElementById(id).dataset.selent = (id === lang) ? 1 : 0;
  })
}

// 生成表格
function WriteToTable(data, text, ismain) {
  try {    
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
  } catch (error) { InError(5, (ismain ? '主表格错误' : '副表格错误') + error.stack, true) }
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

  try {
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
  } catch (error) {
    InError(6, error.stack);
  }

  // 图像
  const img0 = document.getElementById('img0');
  const img1 = document.getElementById('img1');
  img0.src = `${serverRoot}/img/character/${lang}/${id}.jpg`;
  if ([4, 45, 53, 65].includes(id)) { // 开拓者
    img0.dataset.imgdata = "two";
    img1.style.display = null;
    img1.src = `${serverRoot}/img/character/${lang}/${id}_isman.jpg`;
    if (Debug) console.log(`ID:${id} 使用双立绘`)
  } else if ([12, 17].includes(id)) { // 无人物介绍立绘
    img0.dataset.imgdata = "center";
    if (Debug) console.log(`ID:${id} 使用大招立绘`)
  } else {
    fetch(`${serverRoot}/img/character/${lang}/${id}.txt`, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          img0.src = `${serverRoot}/img/character/zh/${id}.jpg`;
          if (Debug) console.log(`ID:${id} 使用中文立绘图`)
        }
      })
  }
}

// 用户服务器选择
function userChooseServer() {
  const selent = document.getElementById('server');
  const serverID = selent.options[selent.selectedIndex].value
  langCfg.userSelect = (serverID === 9) ? '//139.224.2.122' : `//server${serverID}.ycl.cool`;
  fetch(`${langCfg.userSelect}/test.bin`)
    .then(response => { if (!response.ok) InError(2) });
  ChangeLang(langCfg.userSelect);
}

// 错误处理
function InError(errid = 0, errtxt, isThrow = false) {
  const errName = {
    0: "未知错误",
    1: "无可用服务器",
    2: "服务器连接失败",
    3: "语言数据获取失败",
    4: "角色数据获取失败",
    5: "表格数据填充错误",
    6: "角色信息获取失败"
  };
  console.log(`%c${errName[errid]}: ${errtxt}`, 'color: orange');
  document.getElementsByClassName('fault')[0].innerText = langCfg[langCfg.userSelect]["errInfo"];
  if (isThrow) { throw new Error(errName[errid]) }
}