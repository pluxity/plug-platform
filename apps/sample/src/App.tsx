import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { InputText } from "@plug/ui/src/components/Input";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";


function App() {
  const [group1, setGroup1] = useState<string>('');
  const [group2, setGroup2] = useState<string>('');

  const [inputTextValue, setInputTextValue] = useState<string>('');
  const [inputTextInvalid, setInputTextInvalid] = useState<boolean>(false);

  const inputTextDebounce = useCallback(
    debounce((value: string) => {
      setInputTextInvalid(value.length <= 10);
      console.log(value);
    }, 300),
    []
  );

  const inputTextOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTextValue(value);
    inputTextDebounce(value);
  }

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
        <InputText placeholder="텍스트를 입력하세요." labelControl={true} labelText="라벨명" helperText={inputTextInvalid ? "문구를 확인해주세요" : ""} value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} />
        <label>{group1}</label>
        <label>{group2}</label>
      </div>
    </>
  )
}

export default App
