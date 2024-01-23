import * as THREE from 'three';
import { EffectComposer } from 'three/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/postprocessing/RenderPass.js';
import Stats from 'three/libs/stats.module.js';
import { OrbitControls } from 'three/controls/OrbitControls.js';
import { OutlineEffect } from 'three/effects/OutlineEffect.js';
import { MMDLoader } from 'three/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/animation/MMDAnimationHelper.js';

let stats;
let helper, mesh;
let camera, scene, renderer, effect, composer;
let info = document.getElementById('info');
const clock = new THREE.Clock();
// let urlroot = "https://model.ycl.cool";
let urlroot = "models";

// 处理传入参数
let other = getUrlParams('other');
if (!other) {
  var dataurl = "data.json"
} else {
  var dataurl = "data2.json"
}
let id = getUrlParams('id');
if (typeof id === 'undefined') {
  LoadError('URL参数错误', 'The UrlParams "id" is underfind.')
}
var total = await ReadJson('data.json', 0, 'total');
if (!(1 <= id && id <= total && !isNaN(id))) {
  LoadError('URL参数错误', 'The UrlParams "id" is not a number or not exist.')
}
let vmd = getUrlParams('vmd');
if (!(typeof id === 'undefined')) {
  var vmddata = await ReadJson('vmd/data.json', vmd, 0, false, true)
}

// 判断是否为Webkit用户
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (browser().engine == "webkit" || isSafari) {
  alert("!!!注意!!!\n由于Webkit内核对于WebGL兼容性有限, 页面可能出现未知渲染问题。\n若可能请更换非Webkit内核浏览器访问。")
}

// 获取全部角色数据
let roledata = await ReadJson(dataurl, id, 0, false, true);

// 主函数
try {
  Ammo().then(AmmoLib => {
    Ammo = AmmoLib;
    init();
    animate();
  });
} catch (err) {
  LoadError('模型加载器初始化出错', err);
}

// 场景配置
function init() {
  // 创建div
  const container = document.createElement('div');
  document.body.appendChild(container);
  // 相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 40;
  // 背景(黑色)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x151515);
  // 光照
  const ambientLight = new THREE.AmbientLight(0xd8d8d8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xd8d8d8, 3);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  // 抗锯齿
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  // 渲染器
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // 模型加载器
  const loader = new MMDLoader();
  helper = new MMDAnimationHelper();
  // 其他
  effect = new OutlineEffect(renderer);
  stats = new Stats();
  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
  // 提示信息
  info.innerHTML = "模型加载器初始化成功. <hr>若页面长时间未响应请刷新页面!<br>如多次出现,请<a href='https://ycl.cool/blog/index.php/archives/17/'>点此反馈.</a>";
  // 判断开拓者
  if (roledata['name'] == "开拓者") {
    var data = getUrlParams('isman');
    console.log(data)
    if (data == "1") {
      var name = "男主";
    } else {
      var name = "女主";
    }
  } else {
    var name = roledata['name'];
  };
  // var pmxfile = `${name}/index.pmx`;
  var pmxfile = `${urlroot}/${name}/index.pmx`;
  info.innerText = "模型主文件待加载.";
  if (!vmd) {
    loader.load(
      pmxfile,
      (mesh) => {
        // 添加到屏幕( X:0 y:-10 Z:0)
        mesh.position.y = -10;
        scene.add(mesh);
        // 提示信息
        Finish();
      },
      (xhr) => {
        info.innerHTML = "加载模型主文件..." + (xhr.loaded / xhr.total * 100).toFixed(2) + "%<br>" + (xhr.loaded / 1024).toFixed(0) + " KB / " + (xhr.total / 1024).toFixed(0) + " KB";
      },
      (err) => {
        console.error(err);
      }
    );
    weapons(loader, name, roledata['weapons']); // 武器模型
  } else {
    MMDload(loader, pmxfile);
  }

  // 相机
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 100;
  // 窗口拉伸
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 场景渲染和动画
function animate() {
  requestAnimationFrame(animate);
  stats.begin();
  composer.render();
  renderer.toneMappingExposure = Math.pow(1.0, 1);
  renderer.render(scene, camera);
  stats.end();
  helper.update(clock.getDelta());
  renderer.render(scene, camera);
}

// 加载武器模型
function weapons(loader, name, number) {
  if (1 <= number && number <= 4) {
    var x = [0, -10, +10, +5, -5, -10];
    var z = [0, 0, 0, -10, -10, 0];
  } else if (number > 4) {// 姬子、玲可
    var x = [0, -15, +20, +10, -10, -20, 0, +20];
    var z = [0, 0, 0, -15, -15, -15, -15, -15];
  }
  for (let i = 1; i <= number; i++) {
    // 动态添加提示信息
    var info = document.createElement('h3');
    info.style.height = "50px"
    info.style.width = "300px";
    info.style.zIndex = 2;
    info.id = "info" + i;
    info.className = "info";
    info.innerText = `武器模型${i}待加载`
    document.getElementById('progrsess').appendChild(info);
    let infoh3 = document.getElementById('info' + i);

    loader.load(
      `${urlroot}/${name}/${i}.pmx`,
      (mesh) => {
        // 提示信息
        infoh3.style.backgroundColor = "#00ff00a4";
        infoh3.innerText = `武器模型${i}加载完成.`;
        infoh3.style.height = "20px";
        infoh3.style.width = "250px"
        setTimeout(() => {
          infoh3.style.height = "0px";
          infoh3.innerText = "";
          infoh3.style.padding = "0px";
        }, 2000)

        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -10;
        mesh.position.z = z[i];
        scene.add(mesh);
      },
      (xhr) => {
        infoh3.innerHTML = `加载武器模型${i}...` + (xhr.loaded / xhr.total * 100).toFixed(2) + "%<br>" + (xhr.loaded / 1024).toFixed(0) + " KB / " + (xhr.total / 1024).toFixed(0) + " KB";
      },
      (err) => {
        console.error(err);
      });
  }
}

// 加载完成提示信息
function Finish() {
  info.style.backgroundColor = "#00ff00a4";
  info.style.width = "250px";

  // 关闭按钮
  var ok = document.createElement('button');
  ok.innerText = "关闭";
  ok.onclick = () => {
    document.getElementById('progrsess').style.transition = "3s"
    document.getElementById('progrsess').style.top = "-200px";
  }

  if (!other) {// 官方模型
    console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:神帝宇");
    info.innerHTML = "加载完成! 请等待模型贴图下载.<hr>模型来源: 神帝宇<hr>";
    info.appendChild(ok);
    setTimeout(() => {
      document.getElementById('VMDList').style.left = "0px";
      document.getElementById('three').style.top = "-20px"
    }, 1500)
  } else {// 非官方模型
    console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + roledata['from']);
    info.innerHTML = `加载完成! 请等待模型贴图下载.<hr>模型来源: ${roledata['from']}<hr>`;
    info.appendChild(ok);
    // 检查是否可以使用mmd动作
    setTimeout(() => {
      if (roledata['mmd']) {
        document.getElementById('VMDList').style.left = "0px";
      }
      document.getElementById('three').style.top = "-20px";
    }, 1500)
  }
}

// 错误处理
function LoadError(errinfo, error) {
  window.onload = null;
  info.style.width = "100%";
  info.style.backgroundColor = "red";
  info.innerHTML = errinfo + ", 请刷新页面以重新加载!<br>如多次出现,请将下面的详细内容复制并<a href='https://ycl.cool/blog/index.php/archives/17/'>点此反馈.</a><br><hr>" + error;
  throw new Error(error);
}

// 带mmd加载
function MMDload(loader, pmxfile) {
  loader.loadWithAnimation(
    pmxfile,
    `./vmd/${vmd}/index.vmd`,
    (mmd) => {
      // 添加到屏幕( X:0 y:-10 Z:0)
      mesh = mmd.mesh;
      mesh.position.y = -10;
      scene.add(mesh);
      // 监听
      const audioListener = new THREE.AudioListener();
      camera.add(audioListener);
      // 音频对象
      const oceanAmbientSound = new THREE.Audio(audioListener);
      scene.add(oceanAmbientSound);
      // 加载音频资源
      const loader2 = new THREE.AudioLoader();
      info.style.width = "250px";
      loader2.load(
        `./vmd/${vmd}/index.mp3`,
        (audioBuffer) => {
          oceanAmbientSound.setBuffer(audioBuffer);
          // 按钮触发
          var Btn = document.createElement('button');
          Btn.innerText = "开始";
          Btn.onclick = () => {
            // 提示信息
            info.innerHTML = "请稍等..."
            setTimeout(() => {
              document.getElementById('progrsess').style.transition = "3s"
              document.getElementById('progrsess').style.top = "-200px";
            }, 1500)

            // 开始动画
            helper.add(mesh, {
              animation: mmd.animation,
              physics: true
            });
            // 播放音频
            oceanAmbientSound.play();
          }

          // 提示信息
          document.getElementById('VMDList').style.left = "0px";
          info.style.backgroundColor = "#00ff00a4";
          if (!other) {
            console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:神帝宇\nAnimation:\n ID:" + vmd + " Name:" + vmddata['name'] + " From:" + vmddata['from']);
            info.innerHTML = `请等待材质加载完成后点击按钮.<hr>模型来源: 神帝宇 <br>动作来源: ${vmddata['from']} <br>背景音乐: ${vmddata['name']}<br>制作软件: three.js<hr>`;
            info.appendChild(Btn);
          } else {
            console.log("Model:\n ID:" + id + " Name:" + roledata['name'] + " From:" + roledata['from'] + "\nAnimation:\n ID:" + vmd + " Name:" + vmddata['name'] + " From:" + vmddata['from']);
            info.innerHTML = `请等待材质加载完成后点击按钮.<hr>模型来源: ${roledata['from']}<br>动作来源: ${vmddata['from']}<br>背景音乐: ${vmddata['name']}<br>制作软件: three.js<hr>`;
            info.appendChild(Btn);
          }
          document.getElementById('three').style.top = "-20px"
        },
        // 声音回调函数
        (xhr) => {
          info.innerHTML = "加载音频文件..." + (xhr.loaded / xhr.total * 100).toFixed(2) + "%<br>" + (xhr.loaded / 1024).toFixed(0) + " KB / " + (xhr.total / 1024).toFixed(0) + " KB";
        },
        (err) => {
          console.error(err);
        }
      )
    },
    // 模型和动作回调函数
    (xhr) => {
      info.innerHTML = "加载模型文件和动作文件..." + (xhr.loaded / xhr.total * 100).toFixed(2) + "%<br>" + (xhr.loaded / 1024).toFixed(0) + " KB / " + (xhr.total / 1024).toFixed(0) + " KB";
    },
    (err) => {
      console.error(err);
    }
  )
}