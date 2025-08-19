# 🎨 테마 갤러리 (Theme Gallery)

> 큐레이션된 고품질 이미지 라이브러리 - 64개 테마, 768개의 엄선된 이미지

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.4-black.svg)](https://www.framer.com/motion/)

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [프로젝트 구조](#프로젝트-구조)
- [핵심 구현사항](#핵심-구현사항)
- [개발 과정](#개발-과정)
- [배포](#배포)
- [기여](#기여)

## 🎯 프로젝트 소개

테마 갤러리는 크리에이터와 디자이너를 위한 고품질 이미지 라이브러리입니다. 64개의 다양한 테마로 분류된 768개의 엄선된 이미지를 제공하며, 직관적인 UI와 강력한 검색 기능을 통해 원하는 이미지를 쉽게 찾고 다운로드할 수 있습니다.

### ✨ 주요 특징

- 📱 **PWA 지원**: 모바일 앱처럼 설치 가능
- 🔍 **스마트 검색**: 실시간 검색 및 필터링
- 📥 **원클릭 다운로드**: 개별/일괄 다운로드 지원
- 💖 **즐겨찾기**: 로컬 저장소 기반 즐겨찾기
- 🔄 **주간 업데이트**: 매주 새로운 이미지 추가
- 📱 **반응형 디자인**: 모든 디바이스 최적화

## 🚀 주요 기능

### 1. 테마별 이미지 브라우징
- 64개 테마 카테고리 (자연, 건축, 음식, 동물, 기술 등)
- 각 테마당 12개의 고품질 이미지 (총 768개)
- 아름다운 그리드 레이아웃과 호버 효과

### 2. 강력한 검색 시스템
```typescript
// 실시간 검색 및 필터링
const searchImages = (category: string, query: string) => {
  return images.filter(image => 
    image.alt.toLowerCase().includes(query.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
};
```

### 3. 이미지 다운로드 시스템
- **개별 다운로드**: 클릭 한 번으로 이미지 다운로드
- **일괄 다운로드**: 테마별 전체 이미지 다운로드
- **CORS 우회**: Fetch API를 통한 안정적인 다운로드
- **토스트 알림**: 다운로드 상태 실시간 피드백

### 4. PWA 기능
- **오프라인 지원**: 서비스 워커를 통한 캐싱
- **앱 설치**: 홈 화면에 앱으로 설치 가능
- **푸시 알림**: 새 이미지 업데이트 알림

### 5. SEO 최적화
- 동적 메타태그 관리
- Open Graph 및 Twitter Card 지원
- 구조화된 데이터 마크업

## 🛠 기술 스택

### Frontend
- **React 18.2.0** - 컴포넌트 기반 UI 라이브러리
- **TypeScript 4.9.5** - 정적 타입 검사
- **Tailwind CSS 3.3.0** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion 10.16.4** - 애니메이션 라이브러리

### 상태 관리 & 라우팅
- **React Router DOM 6.8.1** - SPA 라우팅
- **React Hooks** - 상태 관리 (useState, useEffect, custom hooks)

### 개발 도구
- **Create React App** - 프로젝트 보일러플레이트
- **PostCSS & Autoprefixer** - CSS 후처리
- **ESLint & Prettier** - 코드 품질 및 포맷팅

### 외부 서비스
- **Unsplash API** - 고품질 이미지 소스
- **Pexels API** - 추가 이미지 소스
- **Pixabay API** - 다양한 이미지 컬렉션

## 🔧 설치 및 실행

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 8.0.0 이상

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/araeLaver/theme-gallery.git
cd theme-gallery

# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
cp .env.example .env.local
# .env.local 파일에서 API 키 설정

# 개발 서버 실행
npm start
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 파일 미리보기
npx serve -s build
```

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── ImageGrid.tsx    # 이미지 그리드 컴포넌트
│   ├── LazyImage.tsx    # 지연 로딩 이미지
│   ├── Navigation.tsx   # 네비게이션 바
│   ├── ThemeCard.tsx    # 테마 카드
│   ├── Toast.tsx        # 토스트 알림 시스템
│   └── SEO/
│       └── MetaTags.tsx # SEO 메타태그 관리
├── pages/               # 페이지 컴포넌트
│   ├── Home.tsx         # 홈 페이지
│   ├── Gallery.tsx      # 전체 갤러리
│   ├── ThemeDetail.tsx  # 테마 상세 페이지
│   ├── About.tsx        # 소개 페이지
│   └── Contact.tsx      # 연락처 페이지
├── hooks/               # 커스텀 훅
│   ├── useFavorites.ts  # 즐겨찾기 관리
│   ├── useImageSearch.ts# 이미지 검색
│   └── useInfiniteScroll.ts # 무한 스크롤
├── utils/               # 유틸리티 함수
│   ├── imageDownloader.ts   # 이미지 다운로드
│   ├── imageUpdater.ts      # 주간 이미지 업데이트
│   └── analytics.ts         # 사용자 분석
├── data/                # 데이터
│   └── themes.ts        # 테마 및 이미지 데이터
└── types/               # TypeScript 타입 정의
    └── theme.ts         # 테마 관련 타입
```

## 💡 핵심 구현사항

### 1. 이미지 지연 로딩 (Lazy Loading)
```typescript
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && <div className="skeleton-loader" />}
    </div>
  );
};
```

### 2. 이미지 다운로드 시스템
```typescript
export const downloadImage = async (image: ImageItem): Promise<boolean> => {
  try {
    const response = await fetch(image.src, { 
      mode: 'cors', 
      credentials: 'omit' 
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName(image);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    // 폴백: 새 탭에서 열기
    window.open(image.src, '_blank');
    return false;
  }
};
```

### 3. 토스트 알림 시스템
```typescript
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      type,
      title,
      message,
      onClose: removeToast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  return { toasts, showSuccess, showError, showInfo };
};
```

## 📈 개발 과정

### Phase 1: 기본 구조 설계
- Create React App으로 프로젝트 초기화
- TypeScript 및 Tailwind CSS 설정
- 기본 컴포넌트 구조 설계
- 라우팅 시스템 구축

### Phase 2: 데이터 및 UI 구현
- 64개 테마 분류 체계 구축
- 768개 고품질 이미지 데이터 수집 및 정리
- 반응형 그리드 레이아웃 구현
- 테마별 상세 페이지 개발

### Phase 3: 핵심 기능 개발
- 이미지 검색 및 필터링 시스템
- 지연 로딩 및 무한 스크롤
- 즐겨찾기 기능
- 토스트 알림 시스템

### Phase 4: 다운로드 시스템
- CORS 우회 다운로드 로직
- 파일명 자동 생성
- 일괄 다운로드 기능
- 다운로드 상태 관리

### Phase 5: PWA 및 최적화
- 서비스 워커 구현
- 매니페스트 파일 설정
- SEO 메타태그 최적화
- 성능 최적화

### Phase 6: 완성 및 배포
- 파비콘 및 아이콘 제작
- README 문서 작성
- GitHub 저장소 설정
- 최종 테스트 및 배포

## 🚀 배포

### Vercel 배포 (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### Netlify 배포
1. GitHub 저장소 연결
2. 빌드 명령어: `npm run build`
3. 배포 폴더: `build`

## 📊 성능 최적화

### 이미지 최적화
- WebP 포맷 우선 사용
- 지연 로딩으로 초기 로딩 속도 개선
- 이미지 크기 최적화 (800px 너비 기준)

### 번들 최적화
- 코드 스플리팅으로 청크 분할
- Tree shaking으로 미사용 코드 제거
- Gzip 압축으로 파일 크기 감소

## 🤝 기여

프로젝트에 기여하고 싶으시다면:

1. 저장소를 Fork합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 개발 가이드라인
- 코드는 TypeScript로 작성
- ESLint 규칙 준수
- 커밋 메시지는 Conventional Commits 형식
- 새로운 기능에는 테스트 코드 포함

## 📞 연락처

프로젝트에 대한 질문이나 제안이 있으시면:

- **GitHub Issues**: [이슈 생성](https://github.com/araeLaver/theme-gallery/issues)
- **프로젝트 링크**: [https://github.com/araeLaver/theme-gallery](https://github.com/araeLaver/theme-gallery)

## 🙏 감사의 말

- **Unsplash**: 아름다운 고품질 이미지 제공
- **Pexels**: 다양한 무료 스톡 이미지
- **Framer Motion**: 부드러운 애니메이션
- **Tailwind CSS**: 빠른 스타일링
- **React 팀**: 훌륭한 라이브러리

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!

**Made with ❤️ by [araeLaver](https://github.com/araeLaver)**
