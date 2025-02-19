import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from './interfaces';
import * as Event from './eventDispatcher';

class Engine3D {

    private dom: HTMLElement;

    private renderer: THREE.WebGLRenderer;
    private composer: Addon.EffectComposer;
    private camera: THREE.PerspectiveCamera;
    private clock: THREE.Clock;

    private ambientLight: THREE.AmbientLight;
    private directionalLight: THREE.DirectionalLight;
    private hemiLight: THREE.HemisphereLight;

    private rootScene: THREE.Scene; // 최상위 루트씬
    private testObj: THREE.Object3D;

    /**
     * 생성자
     * @param container - WebGL이 붙을 dom 객체
     */
    constructor(container: HTMLElement) {
        
        this.dom = container;
        this.clock = new THREE.Clock();

        // 렌더러 생성
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        // 렌더러 그림자 설정
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 톤매핑
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.dom.appendChild(this.renderer.domElement);

        // 카메라
        this.camera = new THREE.PerspectiveCamera(75, this.dom.clientWidth / this.dom.clientHeight, 1.0, 5000);
        this.camera.position.set(0, 10, 10);
        this.camera.lookAt(0, 0, 0);
        this.camera.layers.enable(Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);

        // 씬구조
        this.rootScene = new THREE.Scene();
        this.rootScene.name = '#RootScene';

        // 기본 조명 설정
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.ambientLight.name = '#AmbientLight';
        this.rootScene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.directionalLight.name = '#DirectionalLight';
        this.rootScene.add(this.directionalLight);

        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        this.rootScene.add(this.hemiLight);

        // 디렉셔널 라이트 색상, 위치, 그림자 설정
        this.directionalLight.color.setHSL(0.1, 1, 0.95);
        this.directionalLight.position.set(-1, 1.75, 1);
        this.directionalLight.position.multiplyScalar(30);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 4096;
        this.directionalLight.shadow.mapSize.height = 4096;

        // 이펙트 컴포저
        this.composer = new Addon.EffectComposer(this.renderer);
        this.composer.addPass(new Addon.RenderPass(this.rootScene, this.camera));

        // 창크기변경 이벤트 등록
        window.addEventListener('resize', this.onResize.bind(this));

        // 렌더링 루프 콜백
        this.renderer.setAnimationLoop(this.onRender.bind(this));

        // 초기화 완료 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onEngineInitialized',
            engine: this,
        });

        // 테스트
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.testObj = new THREE.Mesh(geometry, material);
        this.rootScene.add(this.testObj);
    }

    /**
     * 창 크기 변경 이벤트 처리
     */
    onResize(): void {
        // 카메라 종횡비, 렌더러 사이즈 설정
        this.camera.aspect = this.dom.clientWidth / this.dom.clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        this.composer.setSize(this.dom.clientWidth, this.dom.clientHeight);
    }

    /**
     * 렌더링 루프
     */
    onRender(): void {
        
        const deltaTime = this.clock.getDelta();

        // 렌더링 전 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onBeforeRender',
            deltaTime: deltaTime,
        });

        // 업데이트 및 렌더링
        if( this.testObj ) {
            this.testObj.rotateX(1.0 * deltaTime);
            this.testObj.rotateY(2.0 * deltaTime);
            this.testObj.rotateZ(3.0 * deltaTime);
        }
        this.composer.render();

        // 렌더링 후 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onAfterRender',
            deltaTime: deltaTime,
        });
    }
}

export {
    Engine3D
}