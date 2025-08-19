import { ImageItem } from '../types/theme';

/**
 * 이미지를 다운로드하는 유틸리티 함수
 */
export const downloadImage = async (image: ImageItem): Promise<boolean> => {
  try {
    // CORS 문제를 해결하기 위해 fetch를 사용하여 이미지를 가져옴
    const response = await fetch(image.src, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Blob으로 변환
    const blob = await response.blob();
    
    // URL 생성
    const url = window.URL.createObjectURL(blob);
    
    // 다운로드를 위한 임시 링크 생성
    const link = document.createElement('a');
    link.href = url;
    
    // 파일명 생성 (alt 텍스트와 현재 시간 사용)
    const filename = generateFilename(image);
    link.download = filename;
    
    // 링크를 DOM에 추가하고 클릭
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    
    // 대체 방법: 새 탭에서 이미지 열기
    try {
      const newWindow = window.open(image.src, '_blank');
      if (newWindow) {
        // 사용자에게 우클릭 후 "다른 이름으로 저장" 안내
        setTimeout(() => {
          alert('이미지가 새 탭에서 열렸습니다.\n우클릭 후 "다른 이름으로 저장"을 선택해주세요.');
        }, 1000);
        return true;
      }
    } catch (fallbackError) {
      console.error('대체 방법도 실패:', fallbackError);
    }
    
    return false;
  }
};

/**
 * 이미지 파일명 생성
 */
const generateFilename = (image: ImageItem): string => {
  // alt 텍스트를 파일명에 사용할 수 있도록 정리
  const cleanAlt = image.alt
    .replace(/[^a-zA-Z0-9가-힣\s-_]/g, '') // 특수문자 제거
    .replace(/\s+/g, '_') // 공백을 언더스코어로 변경
    .toLowerCase();
  
  // 현재 시간 추가 (중복 방지)
  const timestamp = new Date().getTime();
  
  // 카테고리 추가
  const category = image.category.replace(/[^a-zA-Z0-9]/g, '');
  
  return `${category}_${cleanAlt}_${timestamp}.jpg`;
};

/**
 * 여러 이미지를 ZIP으로 다운로드 (향후 구현)
 */
export const downloadImagesAsZip = async (images: ImageItem[]): Promise<boolean> => {
  try {
    // JSZip 라이브러리가 필요하므로 일단 개별 다운로드로 대체
    console.log('ZIP 다운로드는 개발 중입니다. 개별 다운로드를 진행합니다.');
    
    const downloadPromises = images.map(image => downloadImage(image));
    const results = await Promise.all(downloadPromises);
    
    const successCount = results.filter(Boolean).length;
    alert(`${successCount}/${images.length}개 이미지가 다운로드되었습니다.`);
    
    return successCount > 0;
  } catch (error) {
    console.error('ZIP 다운로드 실패:', error);
    return false;
  }
};

/**
 * 브라우저의 다운로드 지원 여부 확인
 */
export const checkDownloadSupport = (): boolean => {
  // 기본적인 다운로드 지원 확인
  const link = document.createElement('a');
  return typeof link.download !== 'undefined';
};

/**
 * 다운로드 진행 상황을 보여주는 함수
 */
export const downloadWithProgress = async (
  image: ImageItem,
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    const response = await fetch(image.src);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Content-Length가 있는 경우에만 진행률 계산
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      received += value.length;
      
      if (total > 0 && onProgress) {
        onProgress(Math.round((received / total) * 100));
      }
    }

    // Blob 생성
    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);
    
    // 다운로드
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFilename(image);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Progress download failed:', error);
    // 기본 다운로드로 폴백
    return downloadImage(image);
  }
};