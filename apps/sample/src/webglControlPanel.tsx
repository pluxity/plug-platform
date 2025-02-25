import * as React from 'react';
import { Model } from '@plug/engine/src';

/**
 * WebGL 조작 패널
 */
class WebGLControlPanel extends React.Component<any, any> {

    private panelStyle: Record<string, string>;
    private fieldsetStyle: Record<string, string>;

    /**
     * 생성자
     * @param props - 옵션
     */
    constructor(props: {}) {
        super(props);

        // 패널 스타일
        this.panelStyle = {
            background: "rgba(255, 255, 255, 0.7)",
            // color: "white",
            padding: "5px",
            position: "absolute",
            left: "10px",
            top: "10px",
            border: "1px solid",
        };
        // 필드셋 스타일
        this.fieldsetStyle = {
            border: "1px solid",
            padding: "5px",
            margin: "5px",
        };

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
        if (this.state.selectedApiName === "Loader") {
            return (
                <button disabled>LoadGltf</button>
            );
        } else if (this.state.selectedApiName === "Model") {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, "Model.GetHierarchy")}>GetModelHierarchy</button>
                    <br />
                    {this.state.floorData.map((data: any) => (
                        <span key={data.floorId}>
                            <input type="checkbox" id={data.floorId} value={data.floorId} defaultChecked={true} onChange={this.onFloorVisibleCheckChanged.bind(this)}></input>
                            <label htmlFor={data.floorId}>{data.displayName}</label><br />
                        </span>
                    ))}
                    {
                        this.state.floorData.length > 0 &&
                        <span>
                            <button onClick={() => this.setFloorVisibility(true)}>ShowAll</button>
                            <button onClick={() => this.setFloorVisibility(false)}>HideAll</button>
                        </span>
                    }
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
            <div style={this.panelStyle}>
                <fieldset style={this.fieldsetStyle}>
                    <legend>WebGL</legend>
                    <label htmlFor="ApiList">Api List:</label>
                    <select id="ApiList" defaultValue="None" onChange={this.onApiSelectChange.bind(this)}>
                        <option value="None" disabled>Api 선택</option>
                        <option value="Loader">Loader</option>
                        <option value="Model">Model</option>
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
                Model.GetModelHierarchy('funeralhall.glb', (data: any) => {
                    console.log('Model.GetModelHierarchy -> ', data);

                    this.setState({ floorData: data }); // 얻은 층정보로 state 설정
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
}

export default WebGLControlPanel;