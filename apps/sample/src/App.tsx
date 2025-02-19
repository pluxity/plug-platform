import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import ThreeDViewer from "./ThreeDViewer";

function App() {

  return (
    <>
      <div className="bg-black h-screen w-screen">
        <Button>버튼</Button>
        <Time variant={"white"} />
        <ThreeDViewer />
      </div>
    </>
  )
}

export default App
