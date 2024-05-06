import * as UI from 'WebUI';
import * as THREE from 'three';
import Stats from 'three/libs/stats.module.js';
import { OrbitControls } from 'three/controls/OrbitControls.js';
import { OutlineEffect } from 'three/effects/OutlineEffect.js';
import { MMDLoader } from 'three/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/animation/MMDAnimationHelper.js';
import { GUI } from 'three/lil-gui.module.min.js';
console.log('three.js version: ' + THREE.REVISION);

let stats;
let helper, mesh;
let camera, scene, renderer, effect;
const clock = new THREE.Clock();
const gui = new GUI();
let urlroot = "models";

// 初始化
export let other = getUrlParams('other');
export let vmd = getUrlParams('vmd');
export let id = getUrlParams('id');
export let dataurl = other ? "data2.json" : "data.json";
export let roledata = await ReadJson(dataurl, id, 0, false, true);
try { UI.Init() } catch (e) { UI.Error(0, e) };

// 主函数
try {
  Ammo().then(AmmoLib => {
    Ammo = AmmoLib;
    init();
    animate();
  })
} catch (e) {
  UI.Error(3, e)
}

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
  const directionalLight = new THREE.DirectionalLight(0xf4e7e1, 2);
  directionalLight.position.y = 20
  // directionalLight.position.z = 20
  directionalLight.castShadow = true
  scene.add(directionalLight);
  // let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000);
  // scene.add(directionalLightHelper);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  effect = new OutlineEffect(renderer);
  // 模型加载器
  const loader = new MMDLoader();
  helper = new MMDAnimationHelper();
  // 帧数显示(左上角)
  stats = new Stats();
  container.appendChild(stats.dom);
  // 天空盒
  const SkyLoader = new THREE.CubeTextureLoader();
  SkyLoader.setPath('img/skybox/');
  const SkyBox = SkyLoader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg',], () => {
    // 添加到屏幕
    scene.background = SkyBox;
    UI.Finish.Skybox();
  });
  // 模型所在文件夹名称
  let name = roledata['name'];
  if (other) { let name = roledata['folder']; }
  if (roledata['name'] == "开拓者") { let name = (getUrlParams('isman') == "1") ? "男主" : "女主"; }
  if (roledata['name'] == "黄泉") { let name = (getUrlParams('iswhite') == "1") ? "黄泉2" : "黄泉"; };
  let pmxfile = `${urlroot}/${name}/index.pmx`;
  UI.Progress.main(3);
  if (!vmd) {
    loader.load(
      pmxfile,
      (mesh) => {
        // 添加到屏幕( X:0 y:-10 Z:0)
        mesh.position.y = -10;
        mesh.material.castShadow = true;
				mesh.castShadow = true;
				mesh.material.receiveShadow = true;
				mesh.receiveShadow = true;
        scene.add(mesh);
        const modelFolder = gui.addFolder('人物');
        const modelParams = { x: 0, z: 0 }
        modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
          mesh.position.x = modelParams.x;
        });
        modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
          mesh.position.z = modelParams.z;
        });
        // 提示信息
        UI.Finish.Model('text1', 'module', '主模型:');
      },
      (xhr) => {
        UI.Progress.Model(1, xhr, '主模型:');
      },
      (err) => {
        UI.Error(4, err)
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
      mesh.material.castShadow = true;
      mesh.castShadow = true;
      mesh.material.receiveShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      const modelFolder = gui.addFolder('场景');
      const modelParams = { x: 0, z: 0 }
      modelFolder.add(modelParams, 'x', -500, 500).onChange(() => {
        mesh.position.x = modelParams.x;
      });
      modelFolder.add(modelParams, 'z', -500, 500).onChange(() => {
        mesh.position.z = modelParams.z;
      });
      UI.Finish.Model('text2', 'background');
    },
    (xhr) => {
      UI.Progress.Model(2, xhr);
    },
    (err) => {
      console.error(err);
    }
  );

  // 相机
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0;
  controls.maxDistance = 1000;
  // 窗口拉伸
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function updateLight() {
    directionalLight.target.updateMatrixWorld();
    helper.update();
  }
  updateLight();
}

// 场景渲染和动画
function animate() {
  helper.update(clock.getDelta());
  requestAnimationFrame(animate);
  stats.begin();
  effect.render(scene, camera);
  stats.end();
}

function weapons(loader, name, number, gui) {
  let x = [0, -15, +20, +10, -10, -20, 0, +20];
  let z = [0, 0, 0, -15, -15, -15, -15, -15];
  // 素裳(大赤鸢模型太大)
  if (name == "素裳") {
    x = [0, -15, +20, +10, -10];
    z = [0, 0, 0, -20, -20];
  }
  for (let i = 1; i <= number; i++) {
    UI.Start.Weapon(i);
    loader.load(
      `${urlroot}/${name}/${i}.pmx`,
      (mesh) => {
        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -7;
        mesh.position.z = z[i];
        const modelFolder = gui.addFolder(`武器${i}`);
        const modelParams = { x: x[i], z: z[i] }
        modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
          mesh.position.x = modelParams.x;
        });
        modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
          mesh.position.z = modelParams.z;
        });
        scene.add(mesh);
        UI.Finish.Model(`text-w${i}`, `weapon${i}`);
      },
      (xhr) => {
        UI.Progress.Model(`-w${i}`, xhr);
      },
      (err) => {
        console.error(err);
      });
  }
}

function MMDload(loader, pmxfile, gui) {
  UI.Start.Music();
  loader.loadWithAnimation(
    pmxfile,
    `./vmd/${vmd}/index.vmd`,
    (mmd) => {
      // 添加到屏幕( X:0 y:-10 Z:0)
      mesh = mmd.mesh;
      mesh.position.y = -10;
      scene.add(mesh);
      const modelFolder = gui.addFolder('人物');
      const modelParams = { x: 0, z: 0 }
      modelFolder.add(modelParams, 'x', -200, 200).onChange(() => {
        mesh.position.x = modelParams.x;
      });
      modelFolder.add(modelParams, 'z', -200, 200).onChange(() => {
        mesh.position.z = modelParams.z;
      });
      document.getElementById(`text1`).innerText = "加载完成, 等待材质下载.";
      setTimeout(() => {
        document.getElementById('module').style.display = "none";
        UI.Finish.MMD();
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
            UI.Finish.MMD();
            let ok = document.getElementById('start');
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
          UI.Progress.Model(4, xhr);
        },
        (err) => {
          console.error(err);
        }
      );
    },
    // 模型和动作回调函数
    (xhr) => {
      UI.Progress.Model(1, xhr, '模型和动作文件:');
    },
    (err) => {
      console.error(err);
    }
  );
}