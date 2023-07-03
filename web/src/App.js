import Layout from './Layout';
import Home from './Home';
import NewPet from './pets/NewPet';
import PetDetail from './PetDetail';
import EditPet from './pets/EditPet';
import About from './About';
import Missing from './Missing';
import Login from './login/Login';
import Register from './login/Register';
import RequireAuth from './login/RequireAuth';
import { Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Routes>
        {/* Public/Login Page */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          {/* Protected Page */}
          <Route element={<RequireAuth />}>
            <Route index element={<Home />} />
            <Route path="post">
              <Route index element={<NewPet />} />
              <Route path=":id" element={<PetDetail />} />
            </Route>
            <Route path="post/:id/edit">
              <Route index element={<EditPet />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="*" element={<Missing />} />
          </Route>
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
