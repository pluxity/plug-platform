import * as React from 'react';
import { Camera, Event, Interfaces, Model, Path3D, Poi, Util } from '@plug/engine/src';

// 컴포넌트 상태 타입 정의
interface WebGLControlPanelState {
    selectedApiName: string;
    deletePoiId: string;
    setVisiblePoiId: string;
    setLineVisiblePoiId: string;
    setTextVisiblePoiId: string;
    moveToPoiIdValue: string;
    getAnimlistPoiIdValue: string;
    poiAnimNameValue: string;
    moveToFloorIdValue: string;
    backgroundImageUrl: string;
    floorData: Interfaces.FloorInfo[];
}

// 컴포넌트 프롭스 타입 정의
type WebGLControlPanelProps = Record<string, never>;

/**
 * WebGL 조작 패널
 */
class WebGLControlPanel extends React.Component<WebGLControlPanelProps, WebGLControlPanelState> {
    /**
     * 생성자
     * @param props - 옵션
     */
    constructor(props: WebGLControlPanelProps) {
        super(props);

        // 스테이트
        this.state = {
            selectedApiName: 'None',
            deletePoiId: '',
            setVisiblePoiId: '',
            setLineVisiblePoiId: '',
            setTextVisiblePoiId: '',
            moveToPoiIdValue: '',
            moveToFloorIdValue: '',
            getAnimlistPoiIdValue: '',
            poiAnimNameValue: '',
            backgroundImageUrl: '',
            floorData: []
        };

        this.registerViewerEvents();

        console.warn('Path3D', Path3D);
    }

    /**
     * 선택한 api에 따라 메뉴 표출
     * @returns - 메뉴항목
     */
    renderMenu() {
        if (this.state.selectedApiName === 'Camera') {
            return (
                <span>
                    <button disabled>SetEnabled</button>
                    <button onClick={() => Camera.ExtendView(1.0)}>ExtendView</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.GetState')}>GetState</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.SetState')}>SetState</button><br />
                    <input type='text' value={this.state.moveToPoiIdValue} onChange={this.onMoveToPoiTextInputValueChanged.bind(this)} placeholder='이동할 Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.MoveToPoi')}>MoveToPoi</button><br />
                    <input type='text' value={this.state.moveToFloorIdValue} onChange={this.onMoveToFloorTextInputValueChanged.bind(this)} placeholder='이동할 층 Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.MoveToFloor')}>MoveToFloor</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Loader') {
            return (
                <button disabled>LoadGltf</button>
            );
        } else if (this.state.selectedApiName === 'Model') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Model.GetHierarchy')}>GetModelHierarchy</button>
                    <br />
                    {this.state.floorData.map((data: Interfaces.FloorInfo) => (
                        <span key={data.floorId}>
                            <input type='checkbox' id={data.floorId} value={data.floorId} defaultChecked={true} onChange={this.onFloorVisibleCheckChanged.bind(this)}></input>
                            <label htmlFor={data.floorId}>{data.displayName}</label><br />
                        </span>
                    ))}
                    {
                        this.state.floorData.length > 0 &&
                        <span>
                            <button onClick={() => this.setFloorVisibility(true)}>ShowAll</button>
                            <button onClick={() => this.setFloorVisibility(false)}>HideAll</button><br />
                            <button onClick={() => Model.Expand(1.0, 15.0)}>Expand</button>
                            <button onClick={() => Model.Collapse(1.0)}>Collapse</button>
                        </span>
                    }
                </span>
            );
        } else if (this.state.selectedApiName === 'Poi') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create')}>Create</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(MonkeyHead.glb)')}>Create(MonkeyHead.glb)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(ScreenDoor.glb)')}>Create(ScreenDoor.glb)</button><br />
                    <input type='text' value={this.state.deletePoiId} onChange={this.onDeletePoiTextInputValueChanged.bind(this)} placeholder='제거할 Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Delete')}>Delete</button> &nbsp;
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Clear')}>Clear</button>
                    <br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ExportAll')}>ExportAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Import')}>Import(JSON)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ImportSingle')}>Import(Single Object)</button>
                    <br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ExportAll(LocalStorage)')}>ExportAll(LocalStorage)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Import(LocalStorage)')}>Import(LocalStorage)</button>
                    <br />
                    <input type='text' value={this.state.setVisiblePoiId} onChange={this.onSetVisiblePoiTextInputValueChanged.bind(this)} placeholder='Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Show')}>Show</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Hide')}>Hide</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAll')}>Show All</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAll')}>Hide All</button><br /><br />

                    <input type='text' value={this.state.setLineVisiblePoiId} onChange={this.onSetLineVisibleTextInputValueChanged.bind(this)} placeholder='Line Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowLine')}>Show Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideLine')}>Hide Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAllLine')}>Show All Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAllLine')}>Hide All Line</button><br /><br />

                    <input type='text' value={this.state.setTextVisiblePoiId} onChange={this.onSetPoiTextVisibleInputValueChanged.bind(this)} placeholder='DisplayText Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowDisplayText')}>Show DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideDisplayText')}>Hide DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAllDisplayText')}>Show All DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAllDisplayText')}>Hide All DisplayText</button><br /><br />

                    <input type='text' value={this.state.getAnimlistPoiIdValue} onChange={this.onGetAnimListTextInputValueChanged.bind(this)} placeholder='Animation Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.GetAnimationList')}>GetAnimationList</button><br />
                    <input type='text' value={this.state.poiAnimNameValue} onChange={this.onAnimNameTextInputValueChanged.bind(this)} placeholder='Animation Name'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.PlayAnimation')}>PlayAnimation</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StopAnimation')}>StopAnimation</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(translate)')}>StartEdit(translate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(rotate)')}>StartEdit(rotate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(scale)')}>StartEdit(scale)</button>&nbsp;
                    <button onClick={() => Poi.FinishEdit()}>Finish</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Path') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.CreatePath')}>CreatePath</button>
                    <button onClick={() => Path3D.Cancel()}>Cancel</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Finish')}>Finish</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Export')}>Export</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Import')}>Import</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Clear')}>Clear</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Util') {
            return (
                <span>
                    <label htmlFor='bgColor'>색상으로 배경설정:</label><input id='bgColor' type='color' onChange={this.onBackgroundColorChange.bind(this)}></input><br />
                    <label htmlFor='bgImgUrl'>이미지Url로 배경설정:</label><input id="bgImgUrl" type="text" value={this.state.backgroundImageUrl} onChange={this.onBackgroundImageUrlChange.bind(this)}></input><button onClick={this.onApiBtnClick.bind(this, 'Util.SetBackgroundImage')}>설정</button><br />
                </span>
            );
        } else if (this.state.selectedApiName === 'Test') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Test')}>Test</button>
                </span>
            );
        }

        return null;
    }

    /**
     * 렌더링
     */
    render(): React.ReactNode {
        return (
            <div className="control-panel">
                <fieldset className="control-fieldset">
                    <legend>WebGL</legend>
                    <label htmlFor='ApiList'>Api List:</label>
                    <select id='ApiList' defaultValue='None' onChange={this.onApiSelectChange.bind(this)}>
                        <option value='None' disabled>Api 선택</option>
                        <option value='Loader'>Loader</option>
                        <option value='Camera'>Camera</option>
                        <option value='Model'>Model</option>
                        <option value='Poi'>Poi</option>
                        <option value='Path'>Path(작업중)</option>
                        <option value='Util'>Util</option>
                        <option value='Test'>Test</option>
                    </select>
                    <br />
                    {this.renderMenu()}
                </fieldset>
            </div>
        );
    }

    /**
     * api 선택 변경 이벤트
     * @param event - 이벤트 정보
     */
    onApiSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ selectedApiName: event.target.value });
    }

    /**
     * api 버튼 클릭 이벤트
     * @param apiName - Api 명
     */
    onApiBtnClick(apiName: string) {
        switch (apiName) {
            /**
             * Camera
             */
            case 'Camera.GetState': {
                const state = Camera.GetState();
                localStorage.setItem('CameraState', JSON.stringify(state));
            } break;
            case 'Camera.SetState': {
                const state = localStorage.getItem('CameraState');
                if (state === undefined || state === null) {
                    console.warn('no such data of camera state.');
                } else {
                    Camera.SetState(JSON.parse(state), 1.0);
                }
            } break;
            case 'Camera.MoveToPoi': {
                if (this.state.moveToPoiIdValue !== '') {
                    Camera.MoveToPoi(this.state.moveToPoiIdValue, 1.0);
                }
            } break;
            case 'Camera.MoveToFloor': {
                if (this.state.moveToFloorIdValue !== '') {
                    Camera.MoveToFloor(this.state.moveToFloorIdValue, 1.0);
                }
            } break;

            /**
             * Model
             */
            case 'Model.GetHierarchy': {
                const data = Model.GetModelHierarchy();

                console.log('Model.GetModelHierarchy -> ', data);

                this.setState({ floorData: data as any }); // 얻은 층정보로 state 설정
            } break;

            /**
             * Path
             */
            case 'Path.CreatePath': {
                const pathId = window.crypto.randomUUID();
                const color = 0xffffff * Math.random();
                Path3D.CreatePath(pathId, color);
            } break;
            case 'Path.Finish': {
                const pathData = Path3D.Finish();
                console.log('Path3D.Finish -> ', pathData);
            } break;
            case 'Path.Export': {
                const data = Path3D.Export();
                console.log('Path3D.Export -> ', data);
            } break;
            case 'Path.Import': {
                fetch('pathSampleData.json').then(res => res.json()).then(data => Path3D.Import(data));
            } break;
            case 'Path.Clear': {
                Path3D.Clear();
            } break;

            /**
             * Poi
             */
            case 'Poi.Create': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    property: property
                }, (data: unknown) => console.log('Poi.Create Callback', data));
            } break;
            case 'Poi.Create(MonkeyHead.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'monkeyhead.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(MonkeyHead.glb) Callback', data));
            } break;
            case 'Poi.Create(ScreenDoor.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'ScreenDoor.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(ScreenDoor.glb) Callback', data));
            } break;
            case 'Poi.Delete': {
                if (this.state.deletePoiId !== '') {
                    Poi.Delete(this.state.deletePoiId);
                }
            } break;
            case 'Poi.ExportAll': {
                const data = Poi.ExportAll();
                console.log('Poi.ExportAll', data);
            } break;
            case 'Poi.Import': {
                fetch('poiSampleData.json').then(res => res.json()).then(data => {
                    console.log('Poi.Import', data);
                    Poi.Import(data);
                });
            } break;
            case 'Poi.ImportSingle': {
                Poi.Import('{ "id": "ff8419ab-0b64-40a4-bfc2-0f3b317e0b2e", "iconUrl": "SamplePoiIcon.png", "modelUrl": "monkeyhead.glb", "displayText": "ff8419ab", "property": { "testText": "테스트 속성", "testInt": 11, "testFloat": 2.2 }, "floorId": "4", "position": { "x": -11.168609758648447, "y": 0.19880974292755127, "z": -2.6205250759845735 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "scale": { "x": 1, "y": 1, "z": 1 } }');
            } break;
            case 'Poi.ExportAll(LocalStorage)': {
                const data = Poi.ExportAll();
                console.log('Poi.ExportAll', data);
                localStorage.setItem('PoiData', JSON.stringify(data));
            } break;
            case 'Poi.Import(LocalStorage)': {
                const data = localStorage.getItem('PoiData');
                if (data === undefined || data === null) {
                    console.warn('no such data of PoiData.');
                } else {
                    Poi.Import(JSON.parse(data));
                }
            } break;
            case 'Poi.Clear': {
                Poi.Clear();
            } break;
            case 'Poi.Show': {
                Poi.Show(this.state.setVisiblePoiId);
            } break;
            case 'Poi.Hide': {
                Poi.Hide(this.state.setVisiblePoiId);
            } break;
            case 'Poi.ShowAll': {
                Poi.ShowAll();
            } break;
            case 'Poi.HideAll': {
                Poi.HideAll();
            } break;
            case 'Poi.ShowLine': {
                Poi.ShowLine(this.state.setLineVisiblePoiId);
            } break;
            case 'Poi.HideLine': {
                Poi.HideLine(this.state.setLineVisiblePoiId);
            } break;
            case 'Poi.ShowAllLine': {
                Poi.ShowAllLine();
            } break;
            case 'Poi.HideAllLine': {
                Poi.HideAllLine();
            } break;
            case 'Poi.ShowDisplayText': {
                Poi.ShowDisplayText(this.state.setTextVisiblePoiId);
            } break;
            case 'Poi.HideDisplayText': {
                Poi.HideDisplayText(this.state.setTextVisiblePoiId);
            } break;
            case 'Poi.ShowAllDisplayText': {
                Poi.ShowAllDisplayText();
            } break;
            case 'Poi.HideAllDisplayText': {
                Poi.HideAllDisplayText();
            } break;
            case 'Poi.GetAnimationList': {
                const data = Poi.GetAnimationList(this.state.getAnimlistPoiIdValue);
                console.log('Poi.GetAnimationList', data);
            } break;
            case 'Poi.PlayAnimation': {
                Poi.PlayAnimation(this.state.getAnimlistPoiIdValue, this.state.poiAnimNameValue);
            } break;
            case 'Poi.StopAnimation': {
                Poi.StopAnimation(this.state.getAnimlistPoiIdValue);
            } break;
            case 'Poi.StartEdit(translate)': {
                Poi.StartEdit('translate');
            } break;
            case 'Poi.StartEdit(rotate)': {
                Poi.StartEdit('rotate');
            } break;
            case 'Poi.StartEdit(scale)': {
                Poi.StartEdit('scale');
            } break;

            /**
             * Util
             */
            case 'Util.SetBackgroundImage': {
                Util.SetBackground(this.state.backgroundImageUrl);
            } break;

            /**
             * Test
             */
            case 'Test': {
                Poi.Import({
                    "id": "f8ad0d19-5c66-450f-ac80-b9c54125aec1",
                    "iconUrl": "SamplePoiIcon.png",
                    "modelUrl": "ScreenDoor.glb",
                    "displayText": "f8ad0d19",
                    "property": {
                        "testText": "테스트 속성",
                        "testInt": 11,
                        "testFloat": 2.2
                    },
                    "floorId": "1",
                    "position": {
                        "x": 12.850335184656242,
                        "y": -4.210000038146973,
                        "z": -3.049856412525531
                    },
                    "rotation": {
                        "x": 0,
                        "y": -1.1702129926350338,
                        "z": 0
                    },
                    "scale": {
                        "x": 1.9616787134943003,
                        "y": 1.9616787134943003,
                        "z": 1.9616787134943003
                    }
                });
            } break;
        }
    }

    /**
     * 층 객체 체크박스값 변화 이벤트 처리
     */
    onFloorVisibleCheckChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = evt.target;
        if (target.checked)
            Model.Show(target.id);
        else
            Model.Hide(target.id);
    }

    /**
     * 층객체 모든 층 보이기/숨기기
     * @param isVisible - 가시화 여부
     */
    setFloorVisibility(isVisible: boolean) {
        if (isVisible)
            Model.ShowAll();
        else
            Model.HideAll();
    }

    /**
     * poi로 카메라 이동 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onMoveToPoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ moveToPoiIdValue: evt.target.value });
    }

    /**
     * 층으로 카메라 이동 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onMoveToFloorTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ moveToFloorIdValue: evt.target.value });
    }

    /**
     * poi 제거 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onDeletePoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ deletePoiId: evt.target.value });
    }

    /**
     * poi 기사화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetVisiblePoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setVisiblePoiId: evt.target.value });
    }

    /**
     * poi 선 가시화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetLineVisibleTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setLineVisiblePoiId: evt.target.value });
    }

    /**
     * poi 표시명 텍스트 가시화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetPoiTextVisibleInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setTextVisiblePoiId: evt.target.value });
    }

    /**
     * poi 애니메이션 얻기 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onGetAnimListTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ getAnimlistPoiIdValue: evt.target.value });
    }

    /**
     * poi 애니메이션 이름 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onAnimNameTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ poiAnimNameValue: evt.target.value });
    }

    /**
     * util 색상코드로 배경색 설정 값변경 처리
     * @param evt - 이벤트 정보
     */
    onBackgroundColorChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const colorNumber = parseInt(evt.target.value.replace('#', ''), 16);
        Util.SetBackground(colorNumber);
    }

    /**
     * util 이미지로 배경설정 input 값변경 처리
     * @param evt - 이벤트 정보
     */
    onBackgroundImageUrlChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ backgroundImageUrl: evt.target.value });
    }

    /**
     * 뷰어 이벤트 등록
     */
    registerViewerEvents() {
        // poi 편집 이벤트 등록
        Event.AddEventListener('onPoiTransformChange' as never, (evt: any) => {
            console.log(evt);
        });
        // poi 객체 포인터업 이벤트 등록
        Event.AddEventListener('onPoiPointerUp' as never, (evt: any) => {
            console.log(evt);
        });
    }
}

export default WebGLControlPanel;