<template>
  <transition name="preview">
    <div v-if="visible" class="preview">
      <button class="preview-btn" @click="close">Close</button>
      <iframe class="preview-main" :src="url"></iframe>
    </div>
  </transition>
</template>

<script>
import { genMixinGlobalEvents } from './util'

function previewEscHandler(event) {
  const vm = this
  if (event.keyCode === 27 && vm.visible) {
    console.log('close')
    vm.close()
  }
}

export default {
  mixins: [
    genMixinGlobalEvents('keydown', previewEscHandler)
  ],
  data() {
    return {
      visible: false,
      url: ""
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.url = "";
    }
  },
  created() {
    this.$on("preview", ({ url }) => {
      this.visible = true;
      this.url = url;
    });
  },
  mounted() {

  }
};
</script>

<style>
.mark-display .preview {
  transition: opacity 0.3s, transform 0.3s;
  position: absolute;
  left: 5%;
  right: 5%;
  top: 5%;
  bottom: 5%;
  background-color: white;
}
.mark-display .preview-enter {
  opacity: 0;
  transform: scale(0.5);
}
.mark-display .preview-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.mark-display .preview-btn {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px !important;
}
.mark-display .preview-main {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 1px solid gray;
  box-sizing: border-box;
}
</style>
