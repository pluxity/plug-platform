import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as PIXI from 'pixi.js';
import * as Event from './eventDispatcher';
import { Engine3D } from './engine';

let pixiApp: PIXI.Application;
let engine: Engine3D;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {

    engine = evt.engine as Engine3D;

    // 텍스트 텍스쳐 생성을 위한 pixi.js 인스턴스
    pixiApp = new PIXI.Application();
    pixiApp.init({
        autoStart: false,
        backgroundAlpha: 0,
    });
});

/**
 * 대상 재질의 셰이더를 빌보드 세이더로 변경한다.
 * @param target - 대상 재질
 */
function materialToBillboard(target: THREE.Material) {
    target.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>',
            `
            #include <fog_vertex>

            mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vec2 scale;
            scale.x = length( vec3( modelMatrix[0].x, modelMatrix[0].y, modelMatrix[0].z));
            scale.y = length( vec3( modelMatrix[1].x, modelMatrix[1].y, modelMatrix[1].z));

            // 화면 기준 스케일 고정
            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if( isPerspective )
                scale *= -mvPosition.z;

            vec2 center = vec2(0.5, 0.5);
            float rotation = 0.0;

            vec2 alignedPosition = (position.xy - (center - vec2(0.5))) * scale;

            vec2 rotatedPosition;
            rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
            rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;
            gl_Position = projectionMatrix * mvPosition;
            `);
    };
}

/**
 * 텍스트를 텍스쳐에 기록한다.
 * @param text - 텍스트
 * @param outSize - 생성된 텍스쳐 크기
 */
function createTextMaterial(text: string, outSize: THREE.Vector2): THREE.MeshBasicMaterial {

    // 텍스트 스타일
    const textStyle = new PIXI.TextStyle({
        stroke: {
            color: 0x000000,
            width: 5,
            join: 'bevel',
        },
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 0xffffff,
        align: 'center',
    });

    // 사이즈 계산
    const metrics = PIXI.CanvasTextMetrics.measureText(text, textStyle);
    outSize.x = metrics.width;
    outSize.y = metrics.height;

    // pixi.js 라벨 생성 및 스테이지 추가
    const pixiText = new PIXI.Text({
        text: text,
        style: textStyle,
    });
    pixiApp.stage.addChild(pixiText);

    // pixi.js 렌더러의 뷰포트 사이즈를 텍스쳐 크기에 맞춤
    pixiApp.renderer.resize(outSize.x, outSize.y);
    pixiApp.render();

    // three.js 캔버스 텍스쳐 생성
    const texture = new THREE.CanvasTexture(pixiApp.canvas);
    engine.Renderer.initTexture(texture);

    // three.js 재질 생성
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    materialToBillboard(material);

    // pixi.js 텍스트 제거
    pixiApp.stage.removeChild(pixiText);
    pixiText.destroy();

    return material;
}

/**
 * 위치점 메시의 인스턴싱 처리를 위해 주소값에 해당하는 모델링이 다중객체로 구성된 메시면 하나로 합쳐서 반환한다
 * @param url - 모델파일 주소
 */
async function getMergedGeometry(url: string) {
    const loader = new Addon.GLTFLoader();
}
/**
async function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();
    	
        const loader = new THREE.TextureLoader();
        const texture = await loader.loadAsync( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg' );
    	
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    	
        animate();

}

*/
export {
    createTextMaterial,
}