import { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import RessourcesTable from './lists/RessourcesList';
import AddRessource from './pages/addRessource';
import EditRessource from './pages/editRessource';
import PlanList from './lists/planList';
import AddPlan from './pages/addPlan';
import EditPlan from './pages/editPlan';
import SessionsPage from './pages/sessions';
import CreateSession from './pages/sessions/create';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path='/ressources' element={<RessourcesTable/>} />
          <Route path='/addRessource' element={<AddRessource/>} />
          <Route path='/editRessource/:id' element={<EditRessource/>} />
          <Route path='/plans' element={<PlanList/>} />
          <Route path='/addPlan' element={<AddPlan/>} />
          <Route path="/editPlan/:id" element={<EditPlan />} />
          
          {/* Session routes */}
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/create" element={<CreateSession />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;