// import '../bootstrap/css/bootstrap.min.css'
// import '../bootstrap/css/all.min.css'
// import './App.css'
// import Login from './components/Login.jsx'
// import { Route, Routes, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { selectToken } from './redux/slices/authSlice.js'
// import { useEffect, useState } from 'react'
// import ProtectedRoutes from './ProtectedRoutes.jsx'

// const App = () => {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate()
//   const token = useSelector(selectToken);
  
//   useEffect(() => {
//     if (token && loading) {
//       navigate("/");
//     } else if (!token && loading) {
//       navigate("/login");
//     }
//     setLoading(false);
//   }, [token, loading, navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="*" element={<ProtectedRoutes/>} />
//     </Routes>
//   );
// };
  
// export default App;

import '../bootstrap/css/bootstrap.min.css'
import '../bootstrap/css/all.min.css'
import './App.css'
import Login from './components/Login.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken } from './redux/slices/authSlice.js'
import { useEffect, useState } from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'

const App = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const token = useSelector(selectToken);
  
  useEffect(() => {
    const redirectUser = async () => {
      if (token && loading) {
        navigate("/");
      } else if (!token && loading) {
        navigate("/login");
      }
      setLoading(false);
    };

    redirectUser();
  }, [token, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ProtectedRoutes/>} />
    </Routes>
  );
};
  
export default App;
