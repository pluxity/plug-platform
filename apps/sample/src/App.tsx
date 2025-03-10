import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { Textarea } from "@plug/ui/src/components/Textarea";
import Input from "@plug/ui/src/components/Input";
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
        <Textarea aria-label="textarea 입력창" value={textareaValue} onChange={textareaOnChange} resize="both" placeholder="텍스트를 입력하세요." invalid={textareaInvalid} />
        <div className="bg-gray-400 text-sm p-2 my-2">Input Text Guide</div>
        <div className="bg-gray-300 text-sm px-1">Input 묶음</div>
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
        <div className="bg-gray-300 text-sm px-1">Input 단독사용</div>
        <Input.Password placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} />
        <Input.Text placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} iconPosition="leading" iconSvg={NoticeIcon} />
        <label>{group1}</label>
        <label>{group2}</label>
        
        <h2 className="text-xl font-bold mt-8 mb-4">Card 컴포넌트 예제 (합성 패턴)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 카드 예제 */}
          <Card>
            <Card.Header>
              <Card.Title>기본 카드</Card.Title>
              <Card.Description>카드 설명이 여기에 들어갑니다.</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>카드 내용이 여기에 들어갑니다. 다양한 컨텐츠를 포함할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary" className="mr-2">확인</Button>
              <Button variant="outline">취소</Button>
            </Card.Footer>
          </Card>
          
          {/* 닫기 버튼이 있는 카드 */}
          <Card closable onClose={() => alert('카드가 닫혔습니다.')}>
            <Card.Header>
              <Card.Title>닫기 버튼이 있는 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.</p>
            </Card.Content>
          </Card>
          
          {/* 제품 정보 카드 */}
          <Card className="bg-gray-50">
            <Card.Header>
              <Card.Title>제품 정보</Card.Title>
            </Card.Header>
            <Card.Content>
              {products.length > 0 && (
                <div>
                  <h4 className="font-medium">{products[0].name}</h4>
                  <p className="text-gray-600 mt-1">가격: {products[0].price.toLocaleString()}원</p>
                  <Badge color="primary" className="mt-2">{products[0].category}</Badge>
                </div>
              )}
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary">구매하기</Button>
            </Card.Footer>
          </Card>
          
          {/* 커스텀 스타일 카드 */}
          <Card className="bg-blue-50 border-blue-200">
            <Card.Header className="border-b border-blue-100">
              <Card.Title className="text-blue-800">커스텀 스타일 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>각 컴포넌트에 className을 전달하여 스타일을 커스터마이징할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer className="justify-end">
              <Button variant="outline" color="primary">자세히 보기</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  )
}

export default App

