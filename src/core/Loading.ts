import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";

export default class LoadingManager extends BaseThree {
    public loadingManager: THREE.LoadingManager;
    constructor(config: any, instance: ThreeInstance) {
        super(instance);
        const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 0.5 },
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
              uniform float uAlpha;

                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `,
        });
        const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
        this.scene.add(overlay);
        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {
                gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
                console.log("loaded");
            },
            // Progress
            (url,loaded,total) => {
                console.log(loaded,"progress");
            },
            () => {
                console.log("error");
            }
        );
    }
    createOverlay() {
        const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 0.5 },
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
              uniform float uAlpha;

                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `,
        });
        const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
        this.scene.add(overlay);
        return overlayMaterial;
    }

    resize() { }
    update() { }
    dispose() { }
}
