import * as THREE from 'three';
import { EffectComposer } from 'three/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/postprocessing/RenderPass.js';
import Stats from 'three/libs/stats.module.js';
import { OrbitControls } from 'three/controls/OrbitControls.js';
import { OutlineEffect } from 'three/effects/OutlineEffect.js';
import { MMDLoader } from 'three/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/animation/MMDAnimationHelper.js';
import { AutoFinish, MMDFinish, BGFinish } from './Finish.js';
import { GUI } from 'three/lil-gui.module.min.js';

// 提示信息
window.onload = null;
localStorage.setItem('onload', 0);
localStorage.setItem('onload_bg', 0);
document.getElementById('text0').innerText = "(3/4)初始化加载器...";
document.getElementById('progress0').style.width = "50%";
document.getElementById('skybox').style.display = null;
document.getElementById('module').style = null;
document.getElementById('background').style = null;
console.log('three.js version: ' + THREE.REVISION);

let stats;
export let helper, mesh;
let camera, scene, renderer, effect, composer;
const clock = new THREE.Clock();
const gui = new GUI();
let urlroot = "https://model.ycl.cool";
// let urlroot = "models";

// 处理传入参数
export let other = getUrlParams('other');
export let vmd = getUrlParams('vmd');
export let id = getUrlParams('id');
if (!other) {
  var dataurl = "data.json";
} else {
  var dataurl = "data2.json";
};
if (typeof id === 'undefined') {
  alert('URL参数错误\nThe UrlParams "id" is underfind.');
  throw new Error('The UrlParams "id" is underfind.');
};
var total = await ReadJson(dataurl, 0, 'total');
if (!(1 <= id && id <= total && !isNaN(id))) {
  alert('URL参数错误\nThe UrlParams "id" is not a number or not exist.');
  throw new Error('The UrlParams "id" is not a number or not exist.');
};
// 获取全部角色数据
export let roledata = await ReadJson(dataurl, id, 0, false, true);

// 主函数
Ammo().then(AmmoLib => {
  Ammo = AmmoLib;
  init();
  animate();
});

// 场景配置
function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  // 相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 40;
  // 背景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x151515);
  // 光照
  const ambientLight = new THREE.AmbientLight(0xf4e7e1, 1.7);
  scene.add(ambientLight);
  const ambientLightFolder = gui.addFolder('光照');
  const ambientLightParams = {
    intensity: 1.7,
    color: 0xf4e7e1
  };
  ambientLightFolder.add(ambientLightParams, 'intensity', 0, 4).onChange(() => {
    ambientLight.intensity = ambientLightParams.intensity;
  });
  ambientLightFolder.addColor(ambientLightParams, 'color').onChange(() => {
    ambientLight.color.set(ambientLightParams.color);
  });
  // 抗锯齿
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  // 渲染器   
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  effect = new OutlineEffect(renderer);
  // 模型加载器
  const loader = new MMDLoader();
  helper = new MMDAnimationHelper();
  // 其他
  stats = new Stats();
  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
  // 天空盒
  const SkyLoader = new THREE.CubeTextureLoader();
  SkyLoader.setPath('img/skybox/');
  const SkyBox = SkyLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png',], () => {
    // 添加到屏幕
    scene.background = SkyBox;
    // 提示信息
    document.getElementById('text3').innerText = "天空盒加载完成.";
    document.getElementById('progress3').style.width = "100%";
    setTimeout(() => {
      document.getElementById('skybox').style.display = "none";
      BGFinish();
    }, 2000);
  });
  // 判断开拓者
  if (roledata['name'] == "开拓者") {
    var data = getUrlParams('isman');
    if (data == "1") {
      var name = "男主";
    } else {
      var name = "女主";
    }
  } else {
    var name = roledata['name'];
  };
  var pmxfile = `${urlroot}/${name}/index.pmx`;
  document.getElementById('text0').innerText = "(3/4)等待响应...";
  document.getElementById('progress0').style.width = "75%";
  if (!vmd) {
    loader.load(
      pmxfile,
      (mesh) => {
        // 添加到屏幕( X:0 y:-10 Z:0)
        mesh.position.y = -10;
        scene.add(mesh);
        const modelFolder = gui.addFolder('人物');
        const modelParams = {
          x: 0,
          y: -10,
          z: 0
        }
        modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
          mesh.position.x = modelParams.x;
        });
        modelFolder.add(modelParams, 'y', -200, 200).onChange(() => {
          mesh.position.y = modelParams.z;
        });
        modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
          mesh.position.z = modelParams.z;
        });
        // 提示信息
        document.getElementById('text1').innerText = "主模型:加载完成, 请等待材质下载.";
        setTimeout(() => {
          document.getElementById('module').style.display = "none";
          AutoFinish()
        }, 2000)
      },
      (xhr) => {
        document.getElementById('text1').innerText = "主模型:" + "(" + (xhr.loaded / 1024).toFixed(0) + " KB/" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById('progress1').style.width = (xhr.loaded / xhr.total * 100) + "%";
      },
      (err) => {
        console.error(err);
      }
    );
    weapons(loader, name, roledata['weapons'], gui); // 武器模型
  } else {
    MMDload(loader, pmxfile, gui);
  }

  // 场景模型
  loader.load(
    `${urlroot}/background/index.pmx`,
    (mesh) => {
      // 添加到屏幕( X:0 y:-11.7 Z:0)
      mesh.position.y = -11.7;
      scene.add(mesh);
      const modelFolder = gui.addFolder('场景');
      const modelParams = {
        x: 0,
        y: -10,
        z: 0
      }
      modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
        mesh.position.x = modelParams.x;
      });
      modelFolder.add(modelParams, 'y', -200, 200).onChange(() => {
        mesh.position.y = modelParams.z;
      });
      modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
        mesh.position.z = modelParams.z;
      });
      // 提示信息
      document.getElementById('text2').innerText = "加载完成, 等待材质下载.";
      setTimeout(() => {
        document.getElementById('background').style.display = "none";
        BGFinish()
      }, 2000)
    },
    (xhr) => {
      document.getElementById('text2').innerHTML = "(" + (xhr.loaded / 1024).toFixed(0) + " KB /" + (xhr.total / 1024).toFixed(0) + " KB)";
      document.getElementById('progress2').style.width = (xhr.loaded / xhr.total * 100) + "%";
    },
    (err) => {
      console.error(err);
    }
  );

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
  helper.update(clock.getDelta());
  requestAnimationFrame(animate);
  stats.begin();
  composer.render();
  effect.render(scene, camera);
  stats.end();
}

function weapons(loader, name, number, gui) {
  if (1 <= number && number <= 4) {
    var x = [0, -10, +10, +5, -5];
    var z = [0, 0, 0, -10, -10];
  } else if (number > 4) { // 姬子、玲可
    var x = [0, -15, +20, +10, -10, -20, 0, +20];
    var z = [0, 0, 0, -15, -15, -15, -15, -15];
  }
  // 素裳(大赤鸢模型太大)
  if (name == "素裳") {
    var x = [0, -15, +20, +10, -10];
    var z = [0, 0, 0, -20, -20];
  }
  for (let i = 1; i <= number; i++) {
    // 动态添加提示信息
    var info = document.createElement('div');
    info.id = `weapon${i}`;
    info.innerHTML = `<h4>武器模型${i}:<a id="text-w${i}" class="text"></a></h4>
    <div class="progress">
      <div id="progress-w${i}" class="progress-inside" style="width: 0%"></div>
    </div>`;
    document.getElementById('info-main').appendChild(info);

    loader.load(
      `${urlroot}/${name}/${i}.pmx`,
      (mesh) => {
        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -10;
        mesh.position.z = z[i];
        const modelFolder = gui.addFolder(`武器${i}`);
        const modelParams = {
          x: 0,
          y: -10,
          z: 0
        }
        modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
          mesh.position.x = modelParams.x;
        });
        modelFolder.add(modelParams, 'y', -200, 200).onChange(() => {
          mesh.position.y = modelParams.z;
        });
        modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
          mesh.position.z = modelParams.z;
        });
        scene.add(mesh);
        // 提示信息
        document.getElementById(`text-w${i}`).innerText = "加载完成, 请等待材质下载.";
        setTimeout(() => {
          document.getElementById(`weapon${i}`).style.display = "none";
          AutoFinish();
        }, 2000);
      },
      (xhr) => {
        document.getElementById(`text-w${i}`).innerHTML = (xhr.loaded / xhr.total * 100).toFixed(2) + "%(" + (xhr.loaded / 1024).toFixed(0) + " KB /" + (xhr.total / 1024).toFixed(0) + " KB)";
        document.getElementById(`progress-w${i}`).style.width = (xhr.loaded / xhr.total * 100).toFixed(2) + "%";
      },
      (err) => {
        console.error(err);
      });
  }
}


function MMDload(loader, pmxfile, gui) {
  // 提示信息
  var info = document.createElement('div');
  info.id = `music`;
  info.innerHTML = `<h4>音乐文件:<a id="text4" class="text">等待启动...</a></h4>
        <div class="progress">
          <div id="progress4" class="progress-inside" style="width: 0%"></div>
        </div>`;
  document.getElementById('info-main').appendChild(info);
  loader.loadWithAnimation(
    pmxfile,
    `./vmd/${vmd}/index.vmd`,
    (mmd) => {
      // 添加到屏幕( X:0 y:-10 Z:0)
      mesh = mmd.mesh;
      mesh.position.y = -10;
      scene.add(mesh);
      const modelFolder = gui.addFolder('人物');
      const modelParams = {
        x: 0,
        y: -10,
        z: 0
      }
      modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
        mesh.position.x = modelParams.x;
      });
      modelFolder.add(modelParams, 'y', -200, 200).onChange(() => {
        mesh.position.y = modelParams.z;
      });
      modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
        mesh.position.z = modelParams.z;
      });
      document.getElementById(`text1`).innerText = "加载完成, 等待材质下载.";
      setTimeout(() => {
        document.getElementById('module').style.display = "none";
        MMDFinish();
      }, 2000)
      // 监听
      const audioListener = new THREE.AudioListener();
      camera.add(audioListener);
      // 音频对象
      const oceanAmbientSound = new THREE.Audio(audioListener);
      scene.add(oceanAmbientSound);
      // 加载音频资源
      const loader2 = new THREE.AudioLoader();
      loader2.load(
        `./vmd/${vmd}/index.mp3`,
        (audioBuffer) => {
          oceanAmbientSound.setBuffer(audioBuffer);
          document.getElementById('text4').innerText = "加载完成.";
          document.getElementById('music').style.display = "none";
          setTimeout(() => {
            MMDFinish();
            var ok = document.getElementById('start')
            ok.innerText = "开始";
            ok.onclick = () => {
              oceanAmbientSound.setLoop(true);//设置音频循环
              oceanAmbientSound.play();// 播放音频
              document.getElementById('info').style.display = "none";
              // 开始动画
              helper.add(mesh, {
                animation: mmd.animation,
                physics: true,
              });
            }
          }, 2000);

        },
        // 声音回调函数
        (xhr) => {
          document.getElementById('text4').innerText = "(" + (xhr.loaded / 1024).toFixed(0) + " KB /" + (xhr.total / 1024).toFixed(0) + " KB)";
          document.getElementById('progress4').style.width = (xhr.loaded / xhr.total * 100).toFixed(2) + "%";
        },
        (err) => {
          console.error(err);
        }
      );
    },
    // 模型和动作回调函数
    (xhr) => {
      document.getElementById('text1').innerHTML = "模型和动作文件:" + "(" + (xhr.loaded / 1024).toFixed(0) + "KB/" + (xhr.total / 1024).toFixed(0) + "KB)";
      document.getElementById('progress1').style.width = (xhr.loaded / xhr.total * 100).toFixed(2) + "%";
    },
    (err) => {
      console.error(err);
    }
  );
}