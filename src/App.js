import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Notes from './Components/Notes/Notes';
import SignUp from './Components/SignUp/SignUp';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/notes' element={<Notes />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
