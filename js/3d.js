import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';

let stats;
let camera, scene, renderer, effect, composer;
const fileInput = document.getElementById('fileInput');
const data = ""

Ammo().then(function (AmmoLib) {
  Ammo = AmmoLib;
  init(data)
  animate();
});

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const data = reader.result;

    // 在这里执行对PMX文件的处理和渲染

    init(data);
  };

  reader.readAsArrayBuffer(file);
});


// 场景配置
function init(data) {
  // 创建画布
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
  // 渲染器
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // 其他
  effect = new OutlineEffect(renderer);
  stats = new Stats();
  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
  // 提示信息
  let htmlObj = document.getElementById('text_div');
  var a = document.createElement('h3');
  a.innerHTML = "模型加载器初始化成功.";
  htmlObj.appendChild(a);
  var a = document.createElement('h3');
  // 人物模型

  // const fileURL = URL.createObjectURL(event.target.files[0]);
  // const file = fileURL.toString();
  const loader = new MMDLoader();
  loader.load(data, function (mesh) {
    // 添加到屏幕( X:0 y:-10 Z:0)
    mesh.position.y = -10;
    scene.add(mesh);
    // 提示信息
    var a = document.createElement('h3');
    a.innerHTML = "模型主文件加载完成<br><br>开始加载模型材质...<br><br><a style='color:red'>无法获取进度,请自行判断模型材质加载进度!</a><br><a style='color:aqua'></a>";
    htmlObj.appendChild(a);
    setTimeout(function () {
      document.getElementById('progrsess').style.display = "none";
    }, 4000);
  },
    function (xhr) {
      // 提示信息
      a.innerHTML = "加载模型主文件..." + (xhr.loaded / xhr.total * 100).toFixed(4) + "%";
      htmlObj.appendChild(a);
    },
    function (err) {
      console.error(err)
    }
  );
  // 武器模型 
  // weapons(loader, number);
  // 相机事件
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
}
// 加载武器模型
function weapons(loader, number) {
  if (number == 1) {
    loader.load(`./models/${name}/1.pmx`, function (mesh) {
      // 添加到屏幕( X:-10 y:-10 Z:0)
      mesh.position.x = -10;
      mesh.position.y = -10;
      scene.add(mesh);
    })
  } else if (1 < number && number <= 4) {
    let x = [0, -10, +10, +5, -5, -10];
    let z = [0, 0, 0, -10, -10, 0];
    for (let i = 1; i <= number; i++) {
      loader.load(`./models/${name}/${i}.pmx`, function (mesh) {
        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -10;
        mesh.position.z = z[i];
        scene.add(mesh);
      });
    }
  } else if (number = 4 && number != 7) {
    // 姬子
    let x = [0, -20, +20, +10, -10, -20];
    let z = [0, 0, 0, -20, -20, -20];
    for (let i = 1; i <= number; i++) {
      loader.load(`./models/${name}/${i}.pmx`, function (mesh) {
        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -10;
        mesh.position.z = z[i];
        scene.add(mesh);
      });
    }
  } else if (number = 7) {
    // 玲可
    let x = [0, -15, +20, +10, -10, -20, 0, +20];
    let z = [0, 0, 0, -15, -15, -15, -15, -15];
    for (let i = 1; i <= number; i++) {

      console.log(i);
      console.log(x[i]);
      console.log(z[i]);

      loader.load(`./models/${name}/${i}.pmx`, function (mesh) {
        // 添加到屏幕(X,Y,Z)
        mesh.position.x = x[i];
        mesh.position.y = -10;
        mesh.position.z = z[i];
        scene.add(mesh);
      });
    }
  }
}
