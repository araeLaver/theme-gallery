import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import ThemeDetail from './pages/ThemeDetail';
import { NewImagesBanner, NewImagesSection } from './components/NewImagesBanner';
import { imageUpdater } from './utils/imageUpdater';

function App() {
  const [showNewImages, setShowNewImages] = useState(false);

  useEffect(() => {
    // 앱 시작 시 이미지 업데이터 스케줄러 시작
    imageUpdater.scheduleWeeklyUpdate();
  }, []);

  const handleViewNewImages = () => {
    setShowNewImages(true);
  };

  const handleCloseNewImages = () => {
    setShowNewImages(false);
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <NewImagesBanner onViewNewImages={handleViewNewImages} />
        
        {showNewImages && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto w-full">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">새로운 이미지</h2>
                <button
                  onClick={handleCloseNewImages}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <NewImagesSection />
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/theme/:themeId" element={<ThemeDetail />} />
        </Routes>
        </div>
      </Router>
  );
}

export default App;
