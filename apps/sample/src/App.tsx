import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import Input from "@plug/ui/src/components/Input";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { Textarea } from "@plug/ui/src/components/Textarea";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";
import NoticeIcon from "@plug/ui/src/assets/icons/notice.svg";

function App() {
  const [group1, setGroup1] = useState<string>('');
  const [group2, setGroup2] = useState<string>('');

  const [inputTextValue, setInputTextValue] = useState<string>('');
  const [inputTextInvalid, setInputTextInvalid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [textareaValue, setTextareaValue] = useState<string>('');
  const [textareaInvalid, setTextareaInvalid] = useState<boolean>(false);

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
    setError(value.length < 8);
  }
  
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
        <div className="bg-gray-400 text-sm p-2 my-2">Textarea Guide</div>
        <Textarea value={textareaValue} onChange={textareaOnChange} resize="both" placeholder="텍스트를 입력하세요." helperText={textareaInvalid ? "10자 이상 입력해주세요." : ""} invalid={textareaInvalid} />
        <div className="bg-gray-400 text-sm p-2 my-2">Input Text Guide</div>
        <Input.Box>
          <Input.Label>라벨</Input.Label>
          <Input.Text placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} iconPosition="leading" iconSvg={NoticeIcon} />
          <Input.HelperText error={error}>
            {inputTextInvalid ? "비밀번호는 8자 이상이어야 합니다." : "안전한 비밀번호를 입력하세요."}
          </Input.HelperText>
        </Input.Box>
        <Input.Box>
          <Input.Label>라벨</Input.Label>
          <Input.Password placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} />
        </Input.Box>
        <label>{group1}</label>
        <label>{group2}</label>
      </div>
    </>
  )
}

export default App

