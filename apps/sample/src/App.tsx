import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { Radio } from "@plug/ui/src/components/Radio";


function App() {

  return (
    <>
      <div className="h-screen w-screen">
        <Button>버튼</Button>
        <Time>시간</Time>
        <Badge>뱃지</Badge>
        <Checkbox>체크박스</Checkbox>
        <Radio>라디오버튼</Radio>
      </div>
    </>
  )
}

export default App
