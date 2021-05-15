<template>
  <div class="wel">
    <div class="box">
      <ul class="minbox">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ol class="maxbox">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ol>
    </div>
  </div>
</template>

<script>
// import 'assets/js/script.js'
export default {
  name: 'Welcome',
}
</script>

<style scoped>
.wel {
  height: 100%;
  overflow: hidden;
  display: flex;
  background: rgba(0, 0, 0, 0.7) url('~assets/img/universe.png') no-repeat;
  background-size: 100% 100%;
  perspective: 1000px;
  transform-style: preserve-3d;
}
body {
  /*background: url(../img/preview.png) ;*/
  max-width: 100%;
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  background-color: #0f0f0f;
}
li {
  list-style: none;
}
.box {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  position: absolute;
  margin-left: 42%;
  margin-top: 22%;
  transform-style: preserve-3d;
  transform: rotateX(13deg);
  animation: move 30s linear infinite;
  transform: translateZ(9999px);
}
.minbox {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 50px;
  top: 30px;
  transform-style: preserve-3d;
}
.minbox li {
  width: 100px;
  height: 100px;
  position: absolute;
  text-align: center;
  left: 0;
  top: 0;
  transition: all 2s ease;
}
.maxbox {
  width: 800px;
  height: 400px;
  position: absolute;
  left: 0;
  top: -20px;
  transform-style: preserve-3d;
}
.maxbox li {
  width: 200px;
  height: 200px;
  background: #fff;
  border: 0px solid #ccc;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.3;
  transition: all 3s ease;
}
.minbox li:nth-child(1) {
  background: url('~assets/img/constellation_1.jpg') no-repeat center center;
  transform: rotateX(0deg) translateZ(50px);
}
.minbox li:nth-child(2) {
  background: url('~assets/img/constellation_2.jpg') no-repeat center center;
  transform: rotateY(180deg) translateZ(50px);
}
.minbox li:nth-child(3) {
  background: url('~assets/img/constellation_3.jpg') no-repeat center center;
  transform: rotateX(-90deg) translateZ(50px);
}
.minbox li:nth-child(4) {
  background: url('~assets/img/constellation_4.jpg') no-repeat center center;
  transform: rotateX(90deg) translateZ(50px);
}
.minbox li:nth-child(5) {
  background: url('~assets/img/constellation_5.jpg') no-repeat center center;
  transform: rotateY(-90deg) translateZ(50px);
}
.minbox li:nth-child(6) {
  background: url('~assets/img/constellation_6.jpg') no-repeat center center;
  transform: rotateY(90deg) translateZ(50px);
}
.maxbox li:nth-child(1) {
  background: url('~assets/img/constellation_7.jpg') no-repeat center center;
  transform: rotateX(0deg) translateZ(50px);
}
.maxbox li:nth-child(2) {
  background: url('~assets/img/constellation_8.jpg') no-repeat center center;
  transform: rotateY(180deg) translateZ(50px);
}
.maxbox li:nth-child(3) {
  background: url('~assets/img/constellation_9.jpg') no-repeat center center;
  transform: rotateX(-90deg) translateZ(50px);
}
.maxbox li:nth-child(4) {
  background: url('~assets/img/constellation_10.jpg') no-repeat center center;
  transform: rotateX(90deg) translateZ(50px);
}
.maxbox li:nth-child(5) {
  background: url('~assets/img/constellation_11.jpg') no-repeat center center;
  transform: rotateY(-90deg) translateZ(50px);
}
.maxbox li:nth-child(6) {
  background: url('~assets/img/constellation_12.jpg') no-repeat center center;
  transform: rotateY(90deg) translateZ(50px);
}

.maxbox li:nth-child(1) {
  transform: translateZ(100px);
}
.maxbox li:nth-child(2) {
  transform: rotateY(180deg) translateZ(100px);
}
.maxbox li:nth-child(3) {
  transform: rotateX(-90deg) translateZ(100px);
}
.maxbox li:nth-child(4) {
  transform: rotateX(90deg) translateZ(100px);
}
.maxbox li:nth-child(5) {
  transform: rotateY(-90deg) translateZ(100px);
}
.maxbox li:nth-child(6) {
  transform: rotateY(90deg) translateZ(100px);
}
.box:hover ul li:nth-child(1) {
  transform: translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ul li:nth-child(2) {
  transform: rotateY(180deg) translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ul li:nth-child(3) {
  transform: rotateX(-90deg) translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ul li:nth-child(4) {
  transform: rotateX(90deg) translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ul li:nth-child(5) {
  transform: rotateY(-90deg) translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ul li:nth-child(6) {
  transform: rotateY(90deg) translateZ(100px);
  width: 200px;
  height: 200px;
  opacity: 0.8;
  left: -50px;
  top: -50px;
}
.box:hover ol li:nth-child(1) {
  transform: translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
.box:hover ol li:nth-child(2) {
  transform: rotateY(180deg) translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
.box:hover ol li:nth-child(3) {
  transform: rotateX(-90deg) translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
.box:hover ol li:nth-child(4) {
  transform: rotateX(90deg) translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
.box:hover ol li:nth-child(5) {
  transform: rotateY(-90deg) translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
.box:hover ol li:nth-child(6) {
  transform: rotateY(90deg) translateZ(300px);
  width: 400px;
  height: 400px;
  opacity: 0.8;
  left: -100px;
  top: -100px;
}
@keyframes move {
  from {
    transform: rotateX(13deg) rotateY(360deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(13deg) rotateY(0deg) rotateZ(0deg);
  }
}
</style>