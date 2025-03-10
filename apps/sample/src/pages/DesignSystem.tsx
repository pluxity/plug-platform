
import { useState, useCallback } from "react";
import { debounce } from "lodash";

import { Button, Badge, Checkbox, RadioGroup, RadioGroupItem, Textarea, Input, Card } from "@plug/ui";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";
import NoticeIcon from "@plug/ui/src/assets/icons/notice.svg";


// 제품 데이터 샘플
const products = [
  {
    id: 1,
    name: "스마트 센서",
    price: 120000,
    category: "전자기기",
    description: "고성능 스마트 센서입니다.",
    stock: 15
  },
  {
    id: 2,
    name: "공기질 모니터",
    price: 89000,
    category: "환경",
    description: "실내 공기질을 모니터링하는 장치입니다.",
    stock: 8
  },
  {
    id: 3,
    name: "데이터 로거",
    price: 150000,
    category: "측정장비",
    description: "다양한 환경 데이터를 수집하고 저장하는 장치입니다.",
    stock: 12
  }
];

function DesignSystem() {
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
        <p className="flex gap-2 items-center font-bold text-sm">시간</p>
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
      
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">카드 컴포넌트 샘플</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* 제품 카드 목록 */}
          {products.map((product) => (
            <Card key={product.id} className="h-full">
              <Card.Header>
                <Card.Title>{product.name}</Card.Title>
                <Card.Description>
                  <Badge color="primary" className="mt-1">{product.category}</Badge>
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-lg font-semibold text-primary-600">{product.price.toLocaleString()}원</p>
                <p className="text-sm text-gray-500 mt-1">재고: {product.stock}개</p>
              </Card.Content>
              <Card.Footer>
                <Button variant="default" color="primary" className="w-full">
                  장바구니에 추가
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-4">다양한 카드 스타일</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 알림 카드 */}
          <Card className="bg-blue-50 border-blue-200">
            <Card.Header className="pb-2">
              <Card.Title className="text-blue-800 flex items-center">
                <span className="w-5 h-5 mr-2 flex items-center justify-center">
                  <NoticeIcon />
                </span>
                알림
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-blue-700">시스템 점검이 예정되어 있습니다. 2023년 12월 15일 오후 11시부터 오전 2시까지 서비스 이용이 제한될 수 있습니다.</p>
            </Card.Content>
            <Card.Footer className="border-t border-blue-100 pt-3">
              <p className="text-blue-600 text-sm">2023-12-10 09:00:00</p>
            </Card.Footer>
          </Card>
          
          {/* 통계 카드 */}
          <Card className="bg-gray-50">
            <Card.Header>
              <Card.Title>월간 통계</Card.Title>
              <Card.Description>2023년 11월</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">총 방문자</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">신규 가입자</p>
                  <p className="text-2xl font-bold">256</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 판매액</p>
                  <p className="text-2xl font-bold">₩8.2M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">평균 체류시간</p>
                  <p className="text-2xl font-bold">4.5분</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        
        <h3 className="text-xl font-bold mb-4">인터랙티브 카드</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 닫기 버튼이 있는 카드 */}
          <Card closable onClose={() => alert('카드가 닫혔습니다.')}>
            <Card.Header>
              <Card.Title>닫기 가능한 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.</p>
            </Card.Content>
          </Card>
          
          {/* 호버 효과가 있는 카드 */}
          <Card className="transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] cursor-pointer">
            <Card.Header>
              <Card.Title>호버 효과 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>이 카드에 마우스를 올리면 그림자와 위치 효과가 적용됩니다.</p>
            </Card.Content>
            <Card.Footer>
              <Button variant="outline" color="primary" className="w-full">자세히 보기</Button>
            </Card.Footer>
          </Card>
          
          {/* 테두리 강조 카드 */}
          <Card className="border-2 border-primary-500">
            <Card.Header>
              <Card.Title className="text-primary-700">강조 테두리 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>중요한 정보를 강조하기 위해 테두리를 두껍게 표시할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary" className="w-full">확인</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  )
}

export default DesignSystem 