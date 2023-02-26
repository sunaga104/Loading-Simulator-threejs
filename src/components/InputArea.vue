<template>
  <div class="main">
    <!-- エラーメッセージ -->
    <p class="err-message" id="err-message">{{ errMessage }}</p>
    <!-- 名前 -->
    <div class="name">
      <label>name</label>
      <input type="text" id="name" v-model="name" ref="name" />
    </div>
    <!-- サイズ -->
    <div class="size">
      <label>size</label>
      <input
        type="number"
        id="size-x"
        placeholder="縦 cm"
        v-model="sizeX"
        ref="size-x"
      />
      <input
        type="number"
        id="size-y"
        placeholder="横 cm"
        v-model="sizeY"
        ref="size-y"
      />
      <input
        type="number"
        id="size-z"
        placeholder="高 cm"
        v-model="sizeZ"
        ref="size-z"
      />
    </div>
    <!-- ポジション -->
    <div class="position">
      <label>position</label>
      <input
        type="number"
        id="position-x"
        placeholder="x"
        v-model="positionX"
      />
      <input
        type="number"
        id="position-y"
        placeholder="y"
        v-model="positionY"
      />
      <input
        type="number"
        id="position-z"
        placeholder="z"
        v-model="positionZ"
      />
    </div>
    <!-- 重さ -->
    <div class="weight">
      <label>weight</label>
      <input type="number" id="weight" placeholder="kg" v-model="weight" />
    </div>
    <div class="button">
      <button @click="defaultInput()">defaultInput</button>
      <button @click="create()">create</button>
      <button @click="update()">update</button>
      <button @click="deleteObject()">delete</button>
      <button @click="physics()" ref="physics">Physics</button>
      <button @click="clear()">clear</button>
    </div>
    <canvas id="subCanvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "InputArea",
  props: {
    objectList: Array,
  },
  data() {
    return {
      name: "",
      sizeX: "",
      sizeY: "",
      sizeZ: "",
      positionX: "",
      positionY: "",
      positionZ: "",
      weight: "",
      errMessage: "",
    };
  },
  mounted() {},
  methods: {
    clear() {
      this.name = "";
      this.sizeX = "";
      this.sizeY = "";
      this.sizeZ = "";
      this.positionX = "";
      this.positionY = "";
      this.positionZ = "";
      this.weight = "";
    },
    defaultInput() {
      this.sizeX = 50;
      this.sizeY = 50;
      this.sizeZ = 50;
      this.positionX = 10;
      this.positionY = 50;
      this.positionZ = 10;
      this.weight = 50;
    },
    create() {
      if (!this.checkInputBasic()) {
        return;
      }
      if (!this.checkDuplicateGeneration()) {
        return;
      }
      const inputArea = {
        name: this.name,
        sizeX: this.sizeX,
        sizeY: this.sizeY,
        sizeZ: this.sizeZ,
        positionX: this.positionX,
        positionY: this.positionY,
        positionZ: this.positionZ,
        weight: this.weight,
      };

      this.$emit("input-form", inputArea);
    },
    checkInputBasic() {
      this.errMessage = "";
      if (this.name == "") {
        this.errMessage = "nameが空です";
        this.$refs.name.focus();
        this.$refs.name.style.backgroundColor = "#FFCCFF";
        return false;
      }
      return true
    },
    checkDuplicateGeneration() {
      for (let object in this.objectList) {
        if (this.objectList[object] == this.name) {
          this.errMessage = "すでに生成されています";
          this.$refs.name.focus();
          this.$refs.name.style.backgroundColor = "#FFCCFF";
          return false;
        }
      }
      return true;
    },
    physics() {
      this.$refs.physics.blur();
      this.$emit("physics-action");
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  text-align: left;
  padding: 10px 0;
  display: inline-block;
  vertical-align: top;
  background-color: #cccccc;
  width: 350px;
  height: 540px;
  .err-message {
    margin: 0 0;
    color: red;
  }
  label {
    display: block;
    font-size: large;
    padding: 5px 0px;
    margin: 0 0 0 15px;
  }
  input {
    padding: 10px 7px;
    border-radius: 5px;
    border: 0.5px solid rgb(126, 126, 126);
    background-color: #e8e8e8;
    margin: 0 0 0 15px;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.6;
    }
  }

  button {
    padding: 10px 10px;
    border-radius: 5px;
    color: #fff;
    border: 0.5px solid rgb(113, 112, 112);
    background-color: #626262;
    margin: 0 0 0 15px;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.6;
    }
  }
  .size {
    margin-top: 10px;
    input {
      width: 50px;
    }
  }
  .position {
    margin-top: 10px;
    input {
      width: 50px;
    }
  }
  .weight {
    margin-top: 10px;
    input {
      width: 50px;
    }
  }
  .button {
    margin: 20px 0px;
    button {
      margin: 10px;
    }
  }
  #subCanvas {
    margin: 0 10px;
  }
}
</style>
