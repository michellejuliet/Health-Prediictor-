// import { useState } from "react";
import "./App.css";
import DataFields from "./FormData/cvdformData";
import UserProfile from "./FormData/FirstPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserData from "./FormData/users";
import Home from "../src/landingPage/Home";
import HealthData from "./FormData/health";
import PatientData from "./FormData/patientInfo";
import PredictionPage from "./FinalDisplay/prediction";

// import PatientDataProvider from './PatientDataProvider';
// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   // UserButton,
//   // useUser,
//   RedirectToSignIn,
// } from "@clerk/clerk-react";
// import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
// import process from "process";
 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='patients' element={<UserData /> }/>
            <Route path='cvd-table' element={<DataFields /> }/>
            <Route path='health-table/:id' element={<HealthData /> }/>
            <Route path='profile/:id' element={<UserProfile /> }/>
            <Route path='health-table' element={<PatientData /> }/>
            <Route path='prediction/:id' element={<PredictionPage /> }/>
        </Routes>
      </Router>
    </div>
  );
}

// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
// const clerkPubKey ="pk_test_bWFzc2l2ZS1nb2JsaW4tNjUuY2xlcmsuYWNjb3VudHMuZGV2JA";
// console.log(clerkPubKey);

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw "Missing Publishable Key"
// }
 
 
// function App() {
//   return (
//     <ClerkProvider publishableKey={clerkPubKey}>
//       <SignedIn>
//         <MainPage />
//           <Router>
//             <Routes>
//               <Route path='cvd-table' element={<DataFields /> }/>
//             </Routes> 
//           </Router>
//       </SignedIn>
//       <SignedOut>
//         <RedirectToSignIn />
//       </SignedOut>
//     </ClerkProvider>
//   );
// }
 
export default App;
