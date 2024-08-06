import EventEmitter from "./EventEmitter";
import * as THREE from "three";

export default class Time extends EventEmitter {
  private clock: THREE.Clock;
  private start;
  private current;
  private elapsed;
  private delta;
  private timer;
  private index;
  private elapsedTime;
  private animationTick: null | number;
  constructor() {
    super();
    this.clock = new THREE.Clock();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.timer = 0;
    this.index = 0;
    this.elapsedTime = 0;
    this.animationTick = null;
    this.tick();
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = currentTime - this.start;
    this.elapsedTime = this.clock.getElapsedTime();
    this.trigger("tick", null);
    this.animationTick = window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  release() {
    if (this.animationTick) window.cancelAnimationFrame(this.animationTick);
  }
  tickS(interval = 1000, fn: (e: number) => void) {
    this.timer += this.delta;
    if (this.timer >= interval) {
      this.index++;
      this.timer = 0;
      // console.log('每' + interval + '毫秒执行的操作',this.index);
      fn(this.index);
    }
  }
}
