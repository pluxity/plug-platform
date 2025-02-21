import * as React from 'react';

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
            selectedApiName: 'None'
        };
    }

    /**
     * 선택한 api에 따라 메뉴 표출
     * @returns - 메뉴항목
     */
    renderMenu() {
        if( this.state.selectedApiName === "Loader") {
            return (
                <button>로더메뉴</button>
            );
        } else if( this.state.selectedApiName === "Model") {
            return (
                <button>모델메뉴</button>
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
                    <br/>
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
}

export default WebGLControlPanel;