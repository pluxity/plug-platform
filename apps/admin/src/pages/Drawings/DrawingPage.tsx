import { useState, useEffect } from 'react';


const DrawingPage = () => {

  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const imageUrl = 'http://192.168.4.29:9000/plug-platform/icons/fbx/test_01/test_01.jpg';

    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('이미지 로드에 실패했습니다.');
        }
        return response.blob();
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        setImageSrc(objectURL);
      })
      .catch((error) => {
        console.error('오류 발생:', error);
      });
  }, []);

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt="불러온 이미지" />
      ) : (
        <p>이미지를 불러오는 중...</p>
      )}
    </div>
  );
};

export default DrawingPage;
