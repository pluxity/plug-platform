import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { InputText, InputIcon } from "@plug/ui/src/components/Input";
import { InputList, InputListItem } from "@plug/ui/src/components/Input/InputList";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { useState, useRef } from "react";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";


function App() {
  const [group1, setGroup1] = useState<string>('');
  const [group2, setGroup2] = useState<string>('');

  const input_value= useRef<HTMLInputElement>(null);
  console.log(input_value.current?.value);

  return (
    <>
      <div className="h-screen w-screen">
        <div className="bg-gray-400 text-sm p-2 my-2">버튼 Guide</div>
        <Button variant="outline" color="primary">
          <MenuIcon />버튼
        </Button>
        <div className="bg-gray-400 text-sm p-2 my-2">시간 Guide</div>
        <Time>시간</Time>
        <div className="bg-gray-400 text-sm p-2 my-2">뱃지 Guide</div>
        <Badge>뱃지</Badge>
        <div className="bg-gray-400 text-sm p-2 my-2">체크박스 Guide</div>
        <Checkbox label="체크박스" variant="primary" type="circle" disabled/>
        <div className="bg-gray-400 text-sm p-2 my-2">라디오버튼 Guide</div>
        <RadioGroup variant="primary" defaultValue="1" name="group1" onChange={(value) => { setGroup1(value); }}>
          <RadioGroupItem value="1" label="option1"/>
          <RadioGroupItem value="2" label="option2" disabled/>
        </RadioGroup>
        <RadioGroup variant="secondary" defaultValue="3" name="group2" onChange={setGroup2}>
          <RadioGroupItem value="3" label="option3"/>
          <RadioGroupItem value="4" label="option4" />
        </RadioGroup>
        <div className="bg-gray-400 text-sm p-2 my-2">Input Text Guide</div>
        <InputText placeholder="텍스트를 입력하세요." invalid={true} />
        <InputText placeholder="텍스트를 입력하세요." disabled />
        <div className="bg-gray-400 text-sm p-2 my-2">Input List Guide</div>
        <InputList>
          <InputListItem value="선택 1번"/>
          <InputListItem value="선택 2번" />
          <InputListItem value="선택 3번" />
          <InputListItem value="선택 4번" />
          <InputListItem value="선택 5번" />
          <InputListItem value="선택 6번" />
        </InputList>
        <InputList invalid={true}>
          <InputListItem value="선택 1번"/>
          <InputListItem value="선택 2번" />
          <InputListItem value="선택 3번" />
          <InputListItem value="선택 4번" />
          <InputListItem value="선택 5번" />
        </InputList>
        <InputList disabled={true}>
          <InputListItem value="선택 1번"/>
          <InputListItem value="선택 2번" />
          <InputListItem value="선택 3번" />
          <InputListItem value="선택 4번" />
          <InputListItem value="선택 5번" />
        </InputList>
        <label>{group1}</label>
        <label>{group2}</label>
        <input ref={input_value}></input>
      </div>
    </>
  )
}

export default App
