import EventEmitter from "./EventEmitter";
import { sizeConfigType } from "@utils/types/configOptType";

export default class Sizes extends EventEmitter {
  public width: number;
  public height: number;
  public pixelRatio: number;
  private resizeHandler: () => void;
  constructor(config: sizeConfigType) {
    super();
    this.width = 100;
    this.height = 100;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.resizeHandler = () => {
      if (config.type === 'parent') {
        const dom = document.getElementById(config.id);
        if (dom) {
          const container = dom.parentElement;
          if (container) {
            this.width = container.clientWidth;
            this.height = container.clientHeight;
          } else {
            console.error(
              "tips: The parent document cannot be found. Please put the current component inside the parent document ID according to the configuration item."
            );
          }
        } else {
          this.release();
          console.error(
            "tips: Could not find parent element ID, please check the configuration"
          );
        }
      }else {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      }

      if (this.height < 200) {
        this.height = 1080;
      }
      this.trigger("resize", null);
    };
    this.resizeHandler();
    window.addEventListener("resize", this.resizeHandler);
  }
  release() {
    window.removeEventListener("resize", this.resizeHandler);
  }
}
