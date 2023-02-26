<template>
  <div class="main">
    <p v-if ="physicsFlg">物理適応中</p>
    <canvas id="mainCanvas" ref="canvas"></canvas>
    <InputArea
      @input-form="inputForm($event)"
      @physics-action="physicsAction"
      v-bind:objectList="objectList"
    />
    <ButtonDisplay
      v-bind:objectList="objectList"
      @select-box="selectBox($event)"
    />
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

import InputArea from "./InputArea.vue";
import ButtonDisplay from "./ButtonDisplay.vue";
// import { threeToCannon, ShapeType } from "three-to-cannon";
// import Util from "./modules/util";
import BoxObjectController from "./modules/boxObjectController";

export default {
  name: "MainCanvas",
  components: {
    InputArea,
    ButtonDisplay,
  },
  data() {
    return {
      width: 860,
      height: 560,
      physicsFlg: false,
      workObjectName: "",
      objectList: [],
    };
  },
  mounted() {
    this.initMainCanvas();
    document.addEventListener("keydown", this.onKeyDown);
  },
  methods: {
    initMainCanvas() {
      //キャンバス初期化
      this.canvasElement = document.querySelector("#mainCanvas");
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvasElement,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);

      //物理エンジン初期化
      this.world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -50, 0), // m/s²
      });

      // シーンを作成
      this.scene = new THREE.Scene();

      // カメラを作成
      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height);
      this.camera.position.set(200, 50, 200);
      this.controls = new OrbitControls(this.camera, this.canvasElement);
      this.controls.update();

      //水平線描画
      const plane2 = new THREE.GridHelper(600);
      this.scene.add(plane2);
      const plane = new THREE.AxesHelper(300);
      this.scene.add(plane);

      //ライト
      const light = new THREE.AmbientLight(0xffffff, 1.0);
      this.scene.add(light);
      const light2 = new THREE.DirectionalLight(0xffffff, 1);
      light2.position.set(5, 10, 1);
      this.scene.add(light2);

      // 物理エンジン地面作成
      const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      groundBody.position.set(0, 0, 0);
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      this.world.addBody(groundBody);

      // 地面描画
      this.geometry = new THREE.BoxGeometry(200, 3, 200);
      this.material = new THREE.MeshStandardMaterial({
        color: 0x59666e,
        roughness: 0.2,
      });
      this.stage = new THREE.Mesh(this.geometry, this.material);
      this.stage.position.set(0, -1.5, 0);
      this.scene.add(this.stage);

      //オブジェクト管理用
      this.boxObjectController = new BoxObjectController.BoxObjectController(
        this.scene,
        this.world
      );

      this.mainLoop();
    },

    mainLoop() {
      this.renderer.render(this.scene, this.camera);

      if (this.physicsFlg) {
        for (const element of this.boxObjectController.objectList) {
          element.box.position.copy(element.boxBody.position);
          element.box.quaternion.copy(element.boxBody.quaternion);
        }
      }

      this.world.fixedStep();
      requestAnimationFrame(this.mainLoop);
    },

    inputForm(value) {
      this.boxObjectController.createBoxObject(
        value.name,
        { x: value.sizeX, y: value.sizeY, z: value.sizeZ },
        { x: value.positionX, y: value.positionY, z: value.positionZ },
        value.weight
      );
      this.workObjectName = value.name;
      console.log(this.workObjectName);
      this.objectList.push(value.name);
      this.$refs.canvas.focus();
    },
    selectBox(value) {
      this.workObjectName = value;
      console.log(value);
      this.$refs.canvas.focus();
    },
    physicsAction() {
      for (const element of this.boxObjectController.objectList) {
        element.boxBody.position.copy(element.box.position);
        element.boxBody.quaternion.copy(element.box.quaternion);
      }
      if (this.physicsFlg) {
        this.physicsFlg = false;
      } else {
        this.physicsFlg = true;
      }
      this.$refs.canvas.focus();
    },
    onKeyDown(event) {
      if (event.code == "ArrowLeft") {
        console.log("左");
        this.boxObjectController.move("x", -1, this.workObjectName);
      }
      if (event.code == "ArrowRight") {
        console.log("右");
        this.boxObjectController.move("x", 1, this.workObjectName);
      }
      if (event.code == "ArrowUp") {
        console.log("上");
        this.boxObjectController.move("y", 1, this.workObjectName);
      }
      if (event.code == "ArrowDown") {
        console.log("下");
        this.boxObjectController.move("y", -1, this.workObjectName);
      }
      if (event.code == "Space") {
        console.log("スペース");
        this.boxObjectController.move("z", -1, this.workObjectName);
      }
      if (event.code == "KeyB") {
        console.log("Bキー");
        this.boxObjectController.move("z", 1, this.workObjectName);
      }
    },
  },
};
</script>

<style scoped></style>
