import './App.css';
import { Routes,Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='JoinPage' element={<JoinPage/>}/>
        <Route path='LoginPage' element={<LoginPage/>}/>
      </Routes>

    </div>
  );
}

export default App;
