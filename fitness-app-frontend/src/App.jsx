import { Box, Button } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router"
import { setCredentials } from "./store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivityPage = () => {
  return (
  <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
    <p>Hello!</p>
    <ActivityForm onActivitiesAdded = {() => window.location.reload()}/>
    <ActivityList />
  </Box>
  );
} 

function App() {
  const { token, tokenData, login, logout, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  
  // when token, tokenData, dispatch changes, it will be executed.
  // dispatch make sure runs on the first loading
  // if there is token, set the credentials and update in redux store
  useEffect(() => {
    if(token) {
      //  user and token both are being sent
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch])


  return (
    <Router>
      {!token ? ( // if there is no token, still show entire login
        <Button variant="contained" color="#dc004e"
            onClick={() => {
              login();
            }}
        > LOGIN </Button>
      ) : ( // if token is there, take token data and reder it
        // <div>
        //   <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        //   <pre>{JSON.stringify(token, null, 2)}</pre>
        // </div>
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Routes>
            <Route path="/activities" element={<ActivityPage />}/>
            <Route path="/activities/:id" element={<ActivityDetail />}/>

            <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! Please Login.</div>} />
          </Routes>
        </Box>
      )}
    </Router>
  )
}

export default App
