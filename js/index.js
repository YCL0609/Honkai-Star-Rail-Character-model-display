// 处理主表格
fetch('pc.table')
    .then(response => response.text())
    .then(text => {
        // 将数据填入表格
        const pc = document.getElementById('pc');
        pc.innerHTML = text;
        // 手机
        if (isMobile()) {
            // 网页背景
            var url = "url('https://upload-bbs.miyoushe.com/upload/2023/05/08/160629650/a76cc3fdfca9be96d2f716a57852dcdd_5751512773958571924.jpg')";
            document.body.style.background = url;
            // 处理主表续表
            fetch('mobile.table')
                .then(response => response.text())
                .then(text => {
                    // 将数据填入表格
                    const mobile = document.getElementById('mobile');
                    mobile.innerHTML = text;
                })
                .catch(error => console.error(error));
            document.getElementById('moble-div').style.display = "";
            // 遍历单元格隐藏data-device="mobile"单元格
            const cells = document.querySelectorAll('td');
            cells.forEach(cell => {
                // 将符合条件的单元格隐藏
                if (cell.getAttribute('data-device') == 'mobile') {
                    cell.style.display = 'none';
                }
            });
        }
    })
    .catch(error => console.error(error));



// 未分类模型表格
fetch('unknow.table')
    .then(response => response.text())
    .then(text => {
        // 将数据填入表格
        const unknow = document.getElementById('unknow');
        unknow.innerHTML = text;
    })
    .catch(error => console.error(error));

function jump(line, list, name, other) {
    if (typeof (other) == "undefined" || other == null) {
        window.location.href = "picture.html?line=" + line + "&list=" + list + "&name=" + name;
    } else {
        window.location.href = "picture.html?line=" + line + "&list=" + list + "&name=" + name + "&other=" + other;
    }
}

function jump3D(name) {
    window.location.href = "3d.html?name=" + name;
}