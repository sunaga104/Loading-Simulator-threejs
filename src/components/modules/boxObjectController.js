import * as THREE from "three";
import * as CANNON from "cannon-es";
import util from "./util";

/**
 * ボックスオブジェクトコントローラー
 * 生成されたボックスオブジェクトを管理します。
 *
 */
class BoxObjectController {
  constructor(scene, world) {
    this.objectList = new Array();
    this.scene = scene;
    this.world = world;
  }
  createBoxObject(name, size, position, weight) {
    const object = new Box(name, size, position, weight);
    this.objectList.push(object);
    this.scene.add(object.box);
    this.world.addBody(object.boxBody);
  }
  getObject(name) {
    for (const object of this.objectList) {
      if (object.name == name) {
        return object;
      }
    }
    return null;
  }
  move(direction, delta, name) {
    const wkObject = this.getObject(name);
    console.log(wkObject);
    if (wkObject == null) {
      console.log("nullだよ");
      return;
    }
    wkObject.move(direction, delta, this.objectList);
  }
}

//箱オブジェクト
class Box {
  constructor(name, size, position, weight) {
    this.name = name;
    this.geometry = "";
    this.material = "";
    this.box = "";
    this.boxBody = "";
    this.createBoxObject(size, position);
    this.addBoxPhysics(weight);
  }

  createBoxObject(size, position) {
    this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const wkColor = "0xac76" + String(util.getRandom(50, 70));
    this.material = new THREE.MeshLambertMaterial({
      color: Number(wkColor),
      transparent: true,
    });
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.box.position.set(position.x, position.y, position.z);
  }
  addBoxPhysics(weight) {
    const objectVec = new CANNON.Vec3(
      this.box.geometry.parameters.width / 2,
      this.box.geometry.parameters.height / 2,
      this.box.geometry.parameters.depth / 2
    );
    const boxShape = new CANNON.Box(objectVec);
    this.boxBody = new CANNON.Body({ mass: weight, shape: boxShape });
    this.boxBody.position.set(
      this.box.position.x,
      this.box.position.y,
      this.box.position.z
    );
  }
  setObjectToPhysics() {
    this.box.position.copy(this.boxBody.position);
    this.box.quaternion.copy(this.boxBody.quaternion);
  }
  setPhysicsToObject() {
    this.boxBody.position = this.box.position;
    this.boxBody.quaternion = this.box.quaternion;
  }
  copy() {
    return;
  }
  //移動処理
  move(direction, delta, objectList) {
    if (this.canMove(direction, delta, objectList)) {
      if (direction == "x") {
        this.box.position.x += delta;
      }
      if (direction == "y") {
        if (this.box.position.y - this.box.geometry.parameters.height / 2 > 0) {
          this.box.position.y += delta;
        } else {
          if (delta > 0) {
            this.box.position.y += delta;
          }
        }
      }
      if (direction == "z") {
        this.box.position.z += delta;
      }
      console.log("動いていいよ");
    }
  }

  //衝突判定
  canMove(direction, delta, objectList) {
    let resultX = true;
    let resultY = true;
    let resultZ = true;
    let wkPosition = "";

    let A_x1 = "";
    let A_x2 = "";
    let A_y1 = "";
    let A_y2 = "";
    let A_z1 = "";
    let A_z2 = "";
    
    let B_x1 = "";
    let B_x2 = "";
    let B_y1 = "";
    let B_y2 = "";
    let B_z1 = "";
    let B_z2 = "";

    //作業中オブジェクト範囲
    if (direction == "x") {
      wkPosition = this.box.position.x + delta;
      A_x1 = wkPosition - this.box.geometry.parameters.width / 2;
      A_x2 = wkPosition + this.box.geometry.parameters.width / 2;
      A_y1 = this.box.position.y - this.box.geometry.parameters.height / 2;
      A_y2 = this.box.position.y + this.box.geometry.parameters.height / 2;
      A_z1 = this.box.position.z - this.box.geometry.parameters.depth / 2;
      A_z2 = this.box.position.z + this.box.geometry.parameters.depth / 2;
    } else if (direction == "y") {
      wkPosition = this.box.position.y + delta;
      A_x1 = this.box.position.x - this.box.geometry.parameters.width / 2;
      A_x2 = this.box.position.x + this.box.geometry.parameters.width / 2;
      A_y1 = wkPosition - this.box.geometry.parameters.height / 2;
      A_y2 = wkPosition + this.box.geometry.parameters.height / 2;
      A_z1 = this.box.position.z - this.box.geometry.parameters.depth / 2;
      A_z2 = this.box.position.z + this.box.geometry.parameters.depth / 2;
    } else if (direction == "z") {
      wkPosition = this.box.position.z + delta;
      A_x1 = this.box.position.x - this.box.geometry.parameters.width / 2;
      A_x2 = this.box.position.x + this.box.geometry.parameters.width / 2;
      A_y1 = this.box.position.y - this.box.geometry.parameters.height / 2;
      A_y2 = this.box.position.y + this.box.geometry.parameters.height / 2;
      A_z1 = wkPosition - this.box.geometry.parameters.depth / 2;
      A_z2 = wkPosition + this.box.geometry.parameters.depth / 2;
    }

    for (const element of objectList) {
      if (element.name == this.name) {
        continue;
      }
      B_x1 =
        element.box.position.x - element.box.geometry.parameters.width / 2;
      B_x2 =
        element.box.position.x + element.box.geometry.parameters.width / 2;
      B_y1 =
        element.box.position.y - element.box.geometry.parameters.height / 2;
      B_y2 =
        element.box.position.y + element.box.geometry.parameters.height / 2;
      B_z1 =
        element.box.position.z - element.box.geometry.parameters.depth / 2;
      B_z2 =
        element.box.position.z + element.box.geometry.parameters.height / 2;
      console.table({ B_x1, B_x2, B_y1, B_y2, B_z1, B_z2 });
      if (
        (A_x1 <= B_x1 && B_x1 < A_x2 && A_x2 <= B_x2) ||
        (B_x1 <= A_x1 && A_x1 < B_x2 && B_x2 <= A_x2) ||
        (A_x1 <= B_x1 && B_x2 <= A_x2) ||
        (B_x1 <= A_x1 && A_x2 <= B_x2)
      ) {
        if (
          (A_y1 <= B_y1 && B_y1 < A_y2 && A_y2 <= B_y2) ||
          (B_y1 <= A_y1 && A_y1 < B_y2 && B_y2 <= A_y2) ||
          (A_y1 <= B_y1 && B_y2 <= A_y2) ||
          (B_y1 <= A_y1 && A_y2 <= B_y2)
        ) {
          resultX = false;
        }
      }
      if (
        (A_x1 <= B_x1 && B_x1 < A_x2 && A_x2 <= B_x2) ||
        (B_x1 <= A_x1 && A_x1 < B_x2 && B_x2 <= A_x2) ||
        (A_x1 <= B_x1 && B_x2 <= A_x2) ||
        (B_x1 <= A_x1 && A_x2 <= B_x2)
      ) {
        if (
          (A_z1 <= B_z1 && B_z1 < A_z2 && A_z2 <= B_z2) ||
          (B_z1 <= A_z1 && A_z1 < B_z2 && B_z2 <= A_z2) ||
          (A_z1 <= B_z1 && B_z2 <= A_z2) ||
          (B_z1 <= A_z1 && A_z2 <= B_z2)
        ) {
          resultZ = false;
        }
      }
      if (
        (A_y1 <= B_y1 && B_y1 < A_y2 && A_y2 <= B_y2) ||
        (B_y1 <= A_y1 && A_y1 < B_y2 && B_y2 <= A_y2) ||
        (A_y1 <= B_y1 && B_y2 <= A_y2) ||
        (B_y1 <= A_y1 && A_y2 <= B_y2)
      ) {
        if (
          (A_z1 <= B_z1 && B_z1 < A_z2 && A_z2 <= B_z2) ||
          (B_z1 <= A_z1 && A_z1 < B_z2 && B_z2 <= A_z2) ||
          (A_z1 <= B_z1 && B_z2 <= A_z2) ||
          (B_z1 <= A_z1 && A_z2 <= B_z2)
        ) {
          resultY = false;
        }
      }
    }
    if (!resultX && !resultY && !resultZ) {
      return false;
    }
    return true;
  }
}

// 関数をエクスポートします。
export default {
  BoxObjectController,
};
