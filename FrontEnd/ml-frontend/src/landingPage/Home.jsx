// App.js
// import React from 'react';
import './Home.css';
import Header from '../landingPage/LandingPage';
// import Icon from '@mui/material/Icon';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';



function Home() {
  return (
    <div className="app">
      <Header />
      <MainContent />
    </div>
  );
}

function MainContent() {
  return (
    <div className="main-content">
      <HospitalInfo />
      <AddPatientInfo />
    </div>
  );
}

const url = 'http://127.0.0.1:5000/api/stats';

let headers = {
    "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache"
};

function HospitalInfo() {
  const [patientscount, setPatientscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPatientCount() {
      try {
        setLoading(true);
        const response = await fetch(url, { headers });

        if (response.status === 200) {
          const result = await response.json();
          setPatientscount(result.patients);
          setLoading(false);
        } else {
          console.log('Request failed with status code:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    fetchPatientCount();
  }, []);
      
  return (
    <section className="hospital-info">
      {/* <div className='hospital--edits'>  */}
       <Link to="/cvd-table" className='hospital--edits'>
            <p>Edit hospital Information</p>
            <ControlPointRoundedIcon color="primary" />
          </Link>
      {/* </div>  */}

      <div className='hospital--box'>
      <img src="/ku_logo.webp" alt="Doctor" className="doctor-image"/>

        <div className='hospital--box-text'>
        <h1> Kenyatta University Hospital</h1>
        <p> Kahawa West, Nairobi, Kenya</p>
        <p> No. of Patients: {patientscount}</p>
         <Link to="/cvd-table" className='hospital--edits'>
            <p>Add Patients</p>
            <ControlPointRoundedIcon color="primary" />
          </Link>
      {/* <div className='hospital--edits'>  */}
        <Link to="/patients" className='hospital--edits'>
            <p>View list of Patients</p>
            <ControlPointRoundedIcon color="primary" />
          </Link>
      {/* </div> */}
      </div>
      </div>
    </section>
  );
}

function AddPatientInfo() {
  return (
    <section className="add-patient-info">
      <div className='patient--box-text'>
        <p className='patient--main-text'> Add Patient Information</p>
          <Link to="/patients" className='hospital--edits'>
            <p>View list of Patients</p>
            <ControlPointRoundedIcon color="primary" />
          </Link>
          <p className='patient--inline-text'>To add patients health information, view the patients list, click on the patient row then proceed to health information.</p>
          <Link to="/health-table" className='hospital--edits'>
            <p>Add Patients information</p>
            <ControlPointRoundedIcon color="primary" />
          </Link>
      </div>
      <img src="/add_patient.png" alt="Add Patient Form" className="form-image"/>
      {/* Add other Add Patient info elements here */}
    </section>
  );
}

export default Home;
