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
let urlroot = "./models";

// 处理传入参数
var id = getUrlParams('id');
var vmd = getUrlParams('vmd');
var other = getUrlParams('other');
if (typeof id === 'undefined') {
  id = 1
}
if (!other) {
  var dataurl = "./data.json"
} else {
  var dataurl = "./data2.json"
}

// 判断是否为Webkit用户
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (browser().engine == "webkit" || isSafari) {
  alert("!!!注意!!!\n由于Webkit内核对于WebGL兼容性有限,  页面可能出现未知渲染问题。\n若可能请更换非Webkit内核浏览器访问。")
}

// 主函数
try {
  Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    init();
    animate();
  });
} catch (err) {
  info.style.width = "100%";
  info.style.backgroundColor = "red";
  info.innerHTML = "模型加载器初始化出错, 请刷新页面以重新加载!<br>如多次出现初始化错误,请将下面的详细内容复制并<a href='https://ycl.cool/blog/index.php/archives/17/'>点此反馈.</a><br><hr>" + err;
}

// 场景配置
function init() {
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
  // 其他
  effect = new OutlineEffect(renderer);
  stats = new Stats();
  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
  // 提示信息
  info.innerHTML = "模型加载器初始化成功. <hr>若页面长时间未响应请刷新页面!<br>如多次出现,请<a href='https://ycl.cool/blog/index.php/archives/17/'>点此反馈.</a>";
  // 人物模型
  const loader = new MMDLoader();
  helper = new MMDAnimationHelper();
  json(dataurl, id, "name", (name) => {
    // 判断开拓者
    if (name == "开拓者") {
      var data = getUrlParams('data');
      if (data == "1") {
        var name = "男主"
      } else {
        var name = "男主"
      }
    }
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
      // 武器模型
      json(dataurl, id, "weapons", (number) => {
        console.log("ID:" + id + " Name:" + name + " Weapons:" + number);
        if (number) {
          weapons(loader, name, number);
        }
      })
    } else {
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
              // 按钮触发
              var Btn = document.createElement('button');
              Btn.innerText = "开始";
              Btn.onclick = () => {
                oceanAmbientSound.setBuffer(audioBuffer);
                helper.add(mesh, {
                  animation: mmd.animation,
                  physics: true
                });

                // 播放音频
                oceanAmbientSound.play();
                
                // 提示信息
                info.innerHTML = "请稍等..."
                setTimeout(() => {
                  document.getElementById('progrsess').style.transition = "3s"
                  document.getElementById('progrsess').style.top = "-200px";
                  // 防止屏幕上方出现一条黑边
                  setTimeout(() => {
                    document.getElementById('progrsess').style.display = "none";
                  }, 3000)
                  
                }, 1500)
              }

              // 提示信息2
              document.getElementById('VMDList').style.left = "0px";
              info.style.backgroundColor = "#00ff00a4";
              json("./vmd/data.json", vmd, "name", (mmdinfo3) => {
                json("./vmd/data.json", vmd, "from", (mmdinfo2) => {
                  if (!other) {
                    console.log("ID:" + id + " Name:" + name + " ModelFrom:神帝宇 AnimationID:" + vmd + " AnimationName:" + mmdinfo3 + " AnimationFrom:" + mmdinfo2);
                    info.innerHTML = `请等待材质加载完成后点击按钮.<hr>模型来源: 神帝宇 <br>动作来源: ${mmdinfo2} <br>背景音乐: ${mmdinfo3}<br>制作软件: three.js<hr>`;
                    info.appendChild(Btn);
                  } else {
                    json(dataurl, id, "from", (mmdinfo1) => {
                      console.log("ID:" + id + " Name:" + name + " ModelFrom:" + mmdinfo1 + " AnimationID:" + vmd + " AnimationName:" + mmdinfo3 + " AnimationFrom:" + mmdinfo2);
                      info.innerHTML = `请等待材质加载完成后点击按钮.<hr>模型来源: ${mmdinfo1}<br>动作来源: ${mmdinfo2}<br>背景音乐: ${mmdinfo3}<br>制作软件: three.js<hr>`;
                      info.appendChild(Btn);
                    })
                  }
                })
              })
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
  })

  // 相机
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 100;
  window.addEventListener('resize', onWindowResize);
}

// 相机事件
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// 渲染场景
function animate() {
  requestAnimationFrame(animate);
  stats.begin();
  composer.render();
  renderer.toneMappingExposure = Math.pow(1.0, 1);
  renderer.render(scene, camera);
  stats.end();
  render();
}

// 动画
function render() {
  helper.update(clock.getDelta());
  renderer.render(scene, camera);
}

// 加载武器模型
function weapons(loader, name, number) {
  if (number == 1) {
    var x = [0, -10];
    var z = [0, 0];
  } else if (1 < number && number <= 4) {
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
    // 防止屏幕上方出现一条黑边
    setTimeout(() => {
      document.getElementById('progrsess').style.display = "none";
    }, 3000)
  }

  // 官方模型
  if (!other) {
    info.innerHTML = "加载完成! 请等待模型贴图下载.<hr>模型来源: 神帝宇<hr>";
    info.appendChild(ok);
    setTimeout(() => {
      document.getElementById('VMDList').style.left = "0px";
      document.getElementById('three').style.top = "-20px"
    }, 1500)

  // 非官方模型
  } else {
    json(dataurl, id, "from", (from) => {
      info.innerHTML = `加载完成! 请等待模型贴图下载.<hr>模型来源: ${from}<hr>`;
      info.appendChild(ok);
    })
    setTimeout(() => {
      
      // 检查是否可以使用mmd动作
      json(dataurl, id, "mmd", (CanVMD) => {
        if (CanVMD) {
          document.getElementById('VMDList').style.left = "0px";
        }
      })

      document.getElementById('three').style.top = "-20px"
    }, 1500)
  }
}
