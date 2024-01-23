// 无介绍立绘id
var nopic = [4, 12, 17, 25, 45];
// 主表格
JsonToTable('data.json', 'table', true, 'table2');
// 未分类模型
JsonToTable('data2.json', 'table3', false);

async function JsonToTable(file, tablename, main) {
    var data = await ReadJson(file, 0, 0, true);
    for (let i = 1; i <= data[0]['total']; i++) {
        let parts = data[i]['data'].split(",");
        let cell = document.getElementById(`${tablename}-${parts[0]}${parts[1]}`)
        let a = document.createElement('a');
        let note = document.createElement('a');
        let br = document.createElement('br');

        // 设置单元格内容
        a.innerText = data[i]['name'];
        a.href = `3d.html?id=${i}&other=1`;
        note.classList = "note";

        // 主表人物标记
        if (main) {
            // 跳转
            a.href = `picture.html?id=${i}`;
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
            })
            // 手机
            if (isMobile()) {
                document.getElementById('moble-div').style.display = null;
                for (let i = 0; i <= 7; i++) {
                    for (let e = 5; e <= 7; e++) {
                        let td = document.getElementById(`table-${i}${e}`);
                        let td2 = document.getElementById(`table2-${i}${e}`);
                        td.style.display = "none";
                        td2.innerHTML = td.innerHTML;
                    }
                }
            }
        }

        // 添加到页面
        cell.appendChild(a);
        cell.appendChild(note);
        cell.appendChild(br);
    }
}