import * as React from 'react';
import { Model, Poi } from '@plug/engine/src';
import { Button, Checkbox } from "@plug/ui";

// 층 데이터 타입 정의
interface FloorData {
    floorId: string;
    displayName: string;
    [key: string]: unknown;
}

// 컴포넌트 상태 타입 정의
interface WebGLControlPanelState {
    selectedApiName: string;
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
            floorData: []
        };
    }

    /**
     * 선택한 api에 따라 메뉴 표출
     * @returns - 메뉴항목
     */
    renderMenu() {
        if (this.state.selectedApiName === 'Loader') {
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
                </span>
            );
        } else if (this.state.selectedApiName === 'Poi') {
            return (
                <span>
                    <Button onClick={this.onApiBtnClick.bind(this, 'Poi.Create')}>Create</Button>
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
                        <option value='Model'>Model</option>
                        <option value='Poi'>Poi</option>
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
            case 'Model.GetHierarchy': {
                Model.GetModelHierarchy('funeralhall.glb', (data: FloorData[]) => {
                    console.log('Model.GetModelHierarchy -> ', data);

                    this.setState({ floorData: data }); // 얻은 층정보로 state 설정
                });
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
                
                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    modelUrl: modelUrl,
                    displayText: displayText,
                    property: property
                }, (data: unknown) => console.log('Poi.Create Callback', data));
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
}

export default WebGLControlPanel;