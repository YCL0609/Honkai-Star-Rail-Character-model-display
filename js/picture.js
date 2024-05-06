let id = getUrlParams('id');
let listdata = [0, "物理", "火", "冰", "雷", "风", "量子", "虚数"];
let linedata = [0, "毁灭", "巡猎", "智识", "同谐", "虚无", "存护", "丰饶"];
(async () => {
    // URL参数检查
    let total = await ReadJson('data.json', 0, 'total');
    if (!(1 <= id && id <= total && !isNaN(id))) {
        document.getElementById('img1').src = "https://patchwiki.biligame.com/images/sr/a/a9/iz7lu3jtjitew6an9kyiijagnwrfilc.png";
        document.getElementById('name').innerText = "URL参数错误";
        throw new Error('URL参数错误');
    }
    let role = await ReadJson('data.json', id, '', false, true);
    // 姓名
    document.getElementById('name').innerHTML = role['name'];
    // 属性
    let parts = role['data'].split(",");
    let line = parts[0];
    let list = parts[1];
    // 命途
    document.getElementById('line').innerText = linedata[line];
    // 战斗属性
    document.getElementById('list').innerText = listdata[list];
    // 模型
    let model = document.getElementById('model');
    let btn = document.createElement('button');
    if (id == 4 || id == 45) {
        // 开拓者
        btn.innerText = "男主";
        btn.onclick = () => { window.location.href = "3d.html?id=4&isman=1" };
        model.appendChild(btn);
        let btn2 = document.createElement('button');
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
    // 立绘
    // 判断立绘图片的所属域名前缀
    if (role['urlroot']) {
        let picurl_root = "https://patchwiki.biligame.com/images/sr";
    } else {
        let picurl_root = "https://upload-bbs.miyoushe.com/upload";
    }
    // 立绘图片地址
    document.getElementById('img1').src = picurl_root + role['picurl'];
    if (id == 4 || id == 45) {
        // 开拓者
        let imgdiv = document.getElementById('imgdiv');
        let img2 = document.createElement('img');
        img2.id = "img2";
        img2.src = "https://patchwiki.biligame.com/images/sr" + role['picurl2'];
        imgdiv.appendChild(img2);
        let pic = document.getElementById('picture');
        let download2 = document.createElement('button');
        download2.innerText = "女主";
        download2.onclick = () => { window.open(document.getElementById('img2').src, '_blank') };
        pic.appendChild(download2);
        document.getElementById('btn').innerText = "男主";
    }
})();