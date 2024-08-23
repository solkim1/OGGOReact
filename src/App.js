import React from 'react';
import AppRoutes from './routes/Routes'; // 라우트 설정이 포함된 컴포넌트를 가져옵니다

function App() {
  return (
    <div className="App">
      <AppRoutes /> {/* 이 컴포넌트가 라우팅을 관리*/}
    </div>
  );
}

export default App;
