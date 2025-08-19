# 매주 이미지 업데이트 시스템

## 개요
이 시스템은 매주 자동으로 새로운 이미지를 Unsplash와 Pexels API에서 가져와서 테마 갤러리를 업데이트합니다.

## 설정 방법

### 1. API 키 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```env
# Unsplash API 키 (https://unsplash.com/developers에서 발급)
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Pexels API 키 (https://www.pexels.com/api/에서 발급)  
REACT_APP_PEXELS_API_KEY=your_pexels_api_key_here

# 선택 사항
REACT_APP_UPDATE_INTERVAL_HOURS=168  # 7일 = 168시간
REACT_APP_ENABLE_WEEKLY_UPDATES=true
REACT_APP_ENABLE_NEW_IMAGE_BANNER=true
```

### 2. API 키 발급 방법

#### Unsplash API 키
1. [Unsplash Developers](https://unsplash.com/developers) 방문
2. 회원가입/로그인
3. "New Application" 클릭
4. 앱 정보 입력
5. Access Key 복사

#### Pexels API 키  
1. [Pexels API](https://www.pexels.com/api/) 방문
2. 회원가입/로그인
3. "Your API Key" 섹션에서 키 확인
4. API Key 복사

## 작동 방식

### 업데이트 스케줄
- **주기**: 매주 월요일 오전 9시
- **대상 테마**: 인기 있는 12개 테마
- **이미지 수**: 테마당 5개씩 추가 (Unsplash 3개 + Pexels 2개)

### 자동화 프로세스
1. **스케줄러 시작**: 앱 로딩 시 자동으로 시작
2. **API 호출**: 각 테마별로 최신 이미지 검색
3. **로컬 저장**: 새 이미지를 LocalStorage에 저장
4. **사용자 알림**: 배너를 통해 새 이미지 알림
5. **주차별 관리**: 주차가 바뀌면 이전 주차 이미지 정리

### 사용자 인터페이스
- **새 이미지 배너**: 우상단에 애니메이션 배너 표시
- **NEW 뱃지**: 새로운 이미지에 초록색 NEW 뱃지
- **모달 뷰어**: "새 이미지 보기" 클릭 시 전체 화면으로 표시

## 파일 구조

```
src/
├── utils/
│   └── imageUpdater.ts          # 이미지 업데이트 로직
├── components/
│   └── NewImagesBanner.tsx      # 새 이미지 배너 & 섹션
├── types/
│   └── theme.ts                 # 타입 정의 (isNew, dateAdded 추가)
└── index.css                    # 애니메이션 스타일
```

## 수동 업데이트

개발자 콘솔에서 수동으로 업데이트를 실행할 수 있습니다:

```javascript
// 즉시 새 이미지 가져오기
import { imageUpdater } from './src/utils/imageUpdater';

const themes = ['nature', 'urban', 'minimal'];
imageUpdater.getWeeklyNewImages(themes).then(newImages => {
  console.log('새 이미지:', newImages);
});

// 저장된 새 이미지 확인
const stored = imageUpdater.getStoredWeeklyImages();
console.log('저장된 이미지:', stored);
```

## 커스터마이징

### 업데이트 주기 변경
`imageUpdater.ts`에서 `updateInterval` 값 수정:
```typescript
const updateInterval = 24 * 60 * 60 * 1000; // 1일로 변경
```

### 테마별 이미지 수 조정
`fetchNewImagesFromUnsplash()` 함수의 `count` 파라미터 수정:
```typescript
async fetchNewImagesFromUnsplash(query: string, count: number = 10)
```

### 알림 배너 비활성화
App.tsx에서 `NewImagesBanner` 컴포넌트 제거 또는 환경변수로 제어:
```typescript
{process.env.REACT_APP_ENABLE_NEW_IMAGE_BANNER === 'true' && (
  <NewImagesBanner onViewNewImages={handleViewNewImages} />
)}
```

## 문제 해결

### API 호출 실패
- API 키가 올바른지 확인
- API 사용량 제한 확인 (Unsplash: 50req/hr, Pexels: 200req/hr)
- 네트워크 연결 상태 확인

### 이미지 로딩 안됨
- CORS 정책 확인
- 이미지 URL 유효성 검사
- 브라우저 콘솔에서 에러 메시지 확인

### 업데이트가 작동하지 않음
- 로컬스토리지 확인: `localStorage.getItem('weeklyNewImages')`
- 브라우저 콘솔에서 스케줄러 로그 확인
- 시스템 시간이 올바른지 확인

## 성능 최적화

### 이미지 지연 로딩
```typescript
// 이미지 지연 로딩 구현
<img 
  src={image.src} 
  loading="lazy"
  className="w-full h-32 object-cover rounded-lg"
/>
```

### 캐시 관리
```typescript
// 오래된 이미지 데이터 정리
const cleanupOldImages = () => {
  const stored = localStorage.getItem('weeklyNewImages');
  if (stored) {
    const data = JSON.parse(stored);
    const currentWeek = getCurrentWeekNumber();
    if (data.week < currentWeek - 1) {
      localStorage.removeItem('weeklyNewImages');
    }
  }
};
```

## 라이선스 및 크레딧

이 기능은 다음 서비스들을 사용합니다:
- **Unsplash API**: 고품질 무료 사진
- **Pexels API**: 다양한 스톡 사진

각 이미지의 라이선스와 크레딧 정보는 API 응답에 포함되며, 필요시 표시할 수 있습니다.