import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";


function App() {

  return (
    <>
      <div className="h-screen w-screen">
        <Button>버튼</Button>
        <Time>시간</Time>
        <Badge>뱃지</Badge>
        <Checkbox>체크박스</Checkbox>
        <RadioGroup name="radio" size="medium" variant="secondary">
          <RadioGroupItem value="radio">라디오버튼 Option1</RadioGroupItem>
          <RadioGroupItem value="radio2">라디오버튼 Option2</RadioGroupItem>
          <RadioGroupItem value="radio3" disabled>라디오버튼 Option3</RadioGroupItem>
        </RadioGroup>
      </div>
    </>
  )
}

export default App
