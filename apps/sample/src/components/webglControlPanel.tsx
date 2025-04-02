import * as React from 'react';
import * as Px from '@plug/engine/src';
import { Button, Input } from "@plug/ui";

// 층 데이터 타입 정의
interface FloorData {
    floorId: string;
    displayName: string;
    [key: string]: unknown;
}

// 컴포넌트 상태 타입 정의
interface WebGLControlPanelState {
    selectedApiName: string;
    deletePoiId: string;
    moveToPoiIdValue: string;
    floorData: FloorData[];
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
            moveToPoiIdValue: '',
            floorData: []
        };
        console.log('px', Px);
    }

    /**
     * 선택한 api에 따라 메뉴 표출
     * @returns - 메뉴항목
     */
    renderMenu() {
        if (this.state.selectedApiName === 'Camera') {
            return (
                <span>
                    <Button disabled>SetEnabled</Button>
                    <Button onClick={() => Px.Camera.ExtendView()}>ExtendView</Button><br />
                    <Button onClick={this.onApiBtnClick.bind(this, 'Camera.GetState')}>GetState</Button>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Camera.SetState')}>SetState</Button><br />
                    <Input.Text style={{ color: 'white' }} value={this.state.moveToPoiIdValue} onChange={this.onMoveToPoiTextInputValueChanged.bind(this)} placeholder='이동할 Poi Id'></Input.Text>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Camera.MoveToPoi')}>MoveToPoi</Button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Loader') {
            return (
                <Button disabled>LoadGltf</Button>
            );
        } else if (this.state.selectedApiName === 'Model') {
            return (
                <span>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Model.GetHierarchy')}>GetModelHierarchy</Button>
                    <br />
                    {this.state.floorData.map((data: FloorData) => (
                        <span key={data.floorId}>
                            <input type='checkbox' id={data.floorId} value={data.floorId} defaultChecked={true} onChange={this.onFloorVisibleCheckChanged.bind(this)}></input>
                            <label htmlFor={data.floorId}>{data.displayName}</label><br />
                        </span>
                    ))}
                    {
                        this.state.floorData.length > 0 &&
                        <span>
                            <Button onClick={() => this.setFloorVisibility(true)}>ShowAll</Button>
                            <Button onClick={() => this.setFloorVisibility(false)}>HideAll</Button>
                        </span>
                    }
                    <br />
                    <Button onClick={this.onApiBtnClick.bind(this, 'Model.Expand')}>Expand</Button>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Model.Collapse')}>Collapse</Button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Poi') {
            return (
                <span>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.Create')}>Create</Button><br />
                    <Input.Text style={{ color: 'white' }} value={this.state.deletePoiId} onChange={this.onDeletePoiTextInputValueChanged.bind(this)} placeholder='제거할 Poi Id'></Input.Text>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.Delete')}>Delete</Button> &nbsp;
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.Clear')}>Clear</Button>
                    <br />
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.ExportAll')}>ExportAll</Button>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.Import')}>Import(JSON)</Button>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.ImportSingle')}>Import(Single Object)</Button>
                </span>
            );
        } else if (this.state.selectedApiName === 'ETC') {
            return (
                <span>
                    <Button onClick={this.printAllApilist.bind(this, Px, 'Px')}>Print Api List</Button>
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
            <div className="control-panel" style={{ position: 'absolute', background: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
                <fieldset className="control-fieldset">
                    <legend>WebGL</legend>
                    <label htmlFor='ApiList'>Api List:</label>
                    <select id='ApiList' defaultValue='None' onChange={this.onApiSelectChange.bind(this)}>
                        <option value='None' disabled>Api 선택</option>
                        <option value='Camera'>Camera</option>
                        <option value='Loader'>Loader</option>
                        <option value='Model'>Model</option>
                        <option value='Poi'>Poi</option>
                        <option value='ETC'>ETC</option>
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
            case 'Camera.GetState': {
                const state = Px.Camera.GetState();
                localStorage.setItem('CameraState', JSON.stringify(state));
            } break;
            case 'Camera.SetState': {
                const state = localStorage.getItem('CameraState');
                if (state === undefined || state === null) {
                    console.warn('no such data of camera state.');
                } else {
                    Px.Camera.SetState(JSON.parse(state), 1.0);
                }
            } break;
            case 'Camera.MoveToPoi': {
                if (this.state.moveToPoiIdValue !== '') {
                    Px.Camera.MoveToPoi(this.state.moveToPoiIdValue);
                }
            } break;
            case 'Model.GetHierarchy': {
                Px.Model.GetModelHierarchy('funeralhall.glb', (data: FloorData[]) => {
                    console.log('Model.GetModelHierarchy -> ', data);

                    this.setState({ floorData: data }); // 얻은 층정보로 state 설정
                });
            } break;
            case 'Model.Expand': {
                Px.Model.Expand(1.0, 10.0, () => console.log('펼치기 완료'));
            } break;
            case 'Model.Collapse': {
                Px.Model.Collapse(1.0, () => console.log('접기 완료'));
            } break;
            case 'Poi.Create': {
                const sampleModelUrls: (undefined | string)[] = [
                    undefined,
                    'monkeyhead.glb',
                ];
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const modelUrl: string | undefined = sampleModelUrls[Math.floor(Math.random() * sampleModelUrls.length)];
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Px.Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    modelUrl: modelUrl,
                    displayText: displayText,
                    property: property
                }, (data: unknown) => console.log('Poi.Create Callback', data));
            } break;
            case 'Poi.Delete': {
                if (this.state.deletePoiId !== '') {
                    Px.Poi.Delete(this.state.deletePoiId);
                }
            } break;
            case 'Poi.ExportAll': {
                const data = Px.Poi.ExportAll();
                console.log('Poi.ExportAll', data);
            } break;
            case 'Poi.Import': {
                fetch('poiSampleData.json').then(res => res.json()).then(data => {
                    console.log('Poi.Import', data);
                    Px.Poi.Import(data);
                });
            } break;
            case 'Poi.ImportSingle': {
                Px.Poi.Import('{ "id": "38d5af1e-f691-44dc-a177-629113a9f74a", "iconUrl": "SamplePoiIcon.png", "modelUrl": "monkeyhead.glb", "displayText": "38d5af1e", "property": { "testText": "테스트 속성", "testInt": 11, "testFloat": 2.2 }, "floorId": "3", "position": { "x": 4.159452351938749, "y": 8.750820055603981, "z": 17.05535663926353 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "scale": { "x": 1, "y": 1, "z": 1 } }');
            } break;
            case 'Poi.Clear': {
                Px.Poi.Clear();
            } break;
        }
    }

    /**
     * 층 객체 체크박스값 변화 이벤트 처리
     */
    onFloorVisibleCheckChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = evt.target;
        if (target.checked)
            Px.Model.Show(target.id);
        else
            Px.Model.Hide(target.id);
    }

    /**
     * poi 제거 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onDeletePoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ deletePoiId: evt.target.value });
    }

    /**
     * poi로 카메라 이동 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onMoveToPoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ moveToPoiIdValue: evt.target.value });
    }

    /**
     * 층객체 모든 층 보이기/숨기기
     * @param isVisible - 가시화 여부
     */
    setFloorVisibility(isVisible: boolean) {
        if (isVisible)
            Px.Model.ShowAll();
        else
            Px.Model.HideAll();
    }

    /**
     * 대상 객체의 키목록 출력
     * @param target - 대상
     * @param prefix - 접두사
     */
    printAllApilist(target: any, prefix: string) {
        Object.keys(target).forEach(keyName => {
            this.printAllApilist(target[keyName], prefix + '.' + keyName);

            if (typeof (target[keyName]) === 'function')
                console.log(prefix + '.' + keyName,);
        });
    }
}

export default WebGLControlPanel;