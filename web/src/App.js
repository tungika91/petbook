import Layout from './Layout';
import Home from './Home';
import NewPet from './NewPet';
import PostPage from './PostPage';
import EditPet from './EditPet';
import About from './About';
import Missing from './Missing';
import Login from './Login';
import Register from './Register';
import RequireAuth from './RequireAuth';
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
              <Route path=":id" element={<PostPage />} />
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
