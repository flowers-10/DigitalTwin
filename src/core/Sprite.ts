import * as THREE from "three";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";
import { ExtendType } from "@utils/types/ExtendType";

// import { eventBus } from '@BI/utils/eventBus'
export default class Sprite extends BaseThree {
    private scale;
    public spriteGroup: THREE.Group;
    constructor(instance: ThreeInstance) {
        super(instance);
        this.scale = 1;
        this.spriteGroup = new THREE.Group();
    }
    // 创建坐标精灵
    createSprite(data: any) {
        if (!data.length)
            return console.error(
                "tips: Please use the array type for the data configuration items in spriteConfig."
            );
        this.scale = data[0].scaleX;
        this.spriteGroup.name = "location-tips";
        //  wait
        this.resources.on("ready", async () => {
            // this.projection = await this.experience.world?.map3D?.getProjection();
            // if (!this.projection) return;
            // Setup
            data.forEach((item:any) => {
                const texture = this.resources.items[item.texture];
                texture.encoding = THREE.sRGBEncoding;
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture, //设置精灵纹理贴图
                });
                // 透明遮挡问题/GPU过滤
                spriteMaterial.onBeforeCompile = (shader) => {
                    shader.fragmentShader = shader.fragmentShader.replace(
                        "#include <opaque_fragment>",
                        `
                    #include <opaque_fragment>
                    if(gl_FragColor.a <.8){discard;}
                    `
                    );
                };
               
                type NewSprite = ExtendType<THREE.Sprite,'properties'>
                const sprite = new THREE.Sprite(spriteMaterial) as NewSprite
                sprite.scale.set(item.scaleX, item.scaleY, 1); //只需要设置x、y两个分量就可以

                const [x, y] = this.projection([item.longitude, item.latitude]);
                sprite.position.set(x, -y, item.z);
                
                sprite.properties = item;
                this.spriteGroup.add(sprite);
            });
            this.scene.add(this.spriteGroup);
        });
    }
}
