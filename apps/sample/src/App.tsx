import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { Textarea } from "@plug/ui/src/components/Textarea";
import { useState, useCallback } from "react";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";
import { debounce } from "lodash";


function App() {
  const [group1, setGroup1] = useState<string>('');
  const [group2, setGroup2] = useState<string>('');
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [textareaInvalid, setTextareaInvalid] = useState<boolean>(false);
  
  const textareaDebounced = useCallback(
    debounce((value: string) => {
      setTextareaInvalid(value.length <= 10);
      console.log(value);
    }, 500),
    []
  );
  
  const textareaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaValue(value);
    textareaDebounced(value);
  };

  return (
    <>
      <div className="h-screen w-screen">
        <Button variant="outline" color="primary">
          <MenuIcon />버튼
        </Button>
        <Time>시간</Time>
        <Badge>뱃지</Badge>
        <Checkbox label="체크박스" variant="primary" type="circle" disabled/>
        <RadioGroup variant="primary" defaultValue="1" name="group1" onChange={(value) => { setGroup1(value); }}>
          <RadioGroupItem value="1" label="option1"/>
          <RadioGroupItem value="2" label="option2" disabled/>
        </RadioGroup>
        <RadioGroup variant="secondary" defaultValue="3" name="group2" onChange={setGroup2}>
          <RadioGroupItem value="3" label="option3"/>
          <RadioGroupItem value="4" label="option4" />
        </RadioGroup>
        <Textarea value={textareaValue} onChange={textareaOnChange} resize="both" placeholder="텍스트를 입력하세요." helperText={textareaInvalid ? "10자 이상 입력해주세요." : ""} invalid={textareaInvalid}
        />
        <label>{group1}</label>
        <label>{group2}</label>
      </div>
    </>
  )
}

export default App

