import ThreeDViewer from "./ThreeDViewer";
import WebGLControlPanel from "../components/webglControlPanel";

function ThreeDTest() {

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">3D 테스트 페이지</h1>
      <p className="mb-6 text-gray-600">이 페이지는 3D 컨텐츠를 테스트하기 위한 페이지입니다. 필요한 내용을 여기에 추가하세요.</p>
      
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">3D 렌더링 영역</h2>
        <div 
          id="three-container" 
          className="w-full h-[500px] bg-black rounded-lg flex items-center justify-center"
        >
          <p className="text-white">3D 컨텐츠가 여기에 렌더링됩니다.</p>
          <WebGLControlPanel />
          <ThreeDViewer />
        </div>
      </div>
    </div>
  );
}

export default ThreeDTest; 