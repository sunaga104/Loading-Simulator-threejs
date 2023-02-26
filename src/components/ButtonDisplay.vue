<template>
  <div class="main">
    <span v-for="element in objectList" :key="element.id">
      <button @click="selectBox(element)">
        {{ element }}
      </button>
    </span>
  </div>
</template>

<script>
export default {
  name: "ButtonDisplay",
  props: {
    objectList: Array,
  },
  data() {
    return {
      name: "",
    };
  },
  mounted() {},
  methods: {
    selectBox(itemName) {
      this.$emit("select-box", itemName);
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  text-align: left;
  padding: 10px 0;
  display: inline-block;
  width: 1210px;
  height: 100px;
  margin: 0;
  button {
    padding: 10px 10px;
    border-radius: 5px;
    color: #fff;
    border: 0.5px solid rgb(113, 112, 112);
    background-color: #626262;
    margin: 0 15px 10px 0;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 0.6;
    }
  }
}
</style>
