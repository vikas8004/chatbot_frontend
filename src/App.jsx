import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import axiosInstance from "./axios/axiosInstance";
import Sidebar from "./components/Sidebar";
import AuthForm from "./components/auth/Auth";
import { Toaster } from "./components/ui/toaster";
import { setUser } from "./redux/slices/userSlice";
import { LoadingScreen } from "./components/loading/Loading";

// Protect routes based on authentication state
function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  // console.log(user);

  const isAuthenticated = user?.access_token;

  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Simulate loading user data (replace with your actual logic)
    const loadUser = async () => {
      try {
        //Load the user from local storage or api here.
        const data = await axiosInstance.get("/user/auto_login");
        if (data.status === 200) {
          dispatch(setUser(data.data.decoded_user))
        }
      } catch (error) {
        console.log(error);

      }
      finally {
        setIsLoading(false)
      }
    };
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }
  return (
    <>
      <Router>
        <Toaster />
        <Routes>
          {/* Authentication Page */}
          <Route path="/auth" element={<AuthForm user={user} />} />

          {/* Chat Interface - Protected Route */}
          <Route path="/" element={<PrivateRoute><ChatInterface /></PrivateRoute>} />
        </Routes>
      </Router>
    </>
  );
}

// Chat Interface (Sidebar + ChatBot)
const ChatInterface = () => (

  <Sidebar />

);

export default App;