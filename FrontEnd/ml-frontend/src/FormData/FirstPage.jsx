import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FirstPage.css';
import Avatar from '@mui/material/Avatar';

const calculateBmi = (height, weight) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

const UserProfile = () => {
  const [formData, setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": "",
    "Age": "",
  });

  const [HealthData, setHealthData] = useState({
    "gender": "",
    "height": "",
    "weight": "",
    "systolic_bp": "",
    "diastolic_bp": "",
    "BMI": "",
    "alcohol": "",
    "activity_level": "",
    "smoking": "",
    "glucose_level": "",
    "cholesterol_level": "",
    "cardio": ""
  });

  const [active, setActive] = useState(1);
  const [Contactinfovisible, setContactinfovisible] = useState(true);
  const [Healthinfovisible, setHealthinfovisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [healthInfoId, setHealthInfoId] = useState(null);
  // const [healthDataExists, setHealthDataExists] = useState(false);
  const [health_id, setHealth_id] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Function to calculate BMI
  const calculateBMI = (height, weight) => {
    if (height > 0 && weight > 0) {
      // Convert height from cm to meters for BMI calculation
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return "";
  };

  const handleHealthDataChange = (event) => {
    const { name, value } = event.target;
    const updatedHealthData = { ...HealthData, [name]: value };

    // Automatically calculate BMI when height or weight changes
    if (name === "height" || name === "weight") {
      const bmi = calculateBMI(updatedHealthData.height, updatedHealthData.weight);
      updatedHealthData.BMI = bmi;
    }

    setHealthData(updatedHealthData);
  };

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };
 
  const handleSaveChanges = () => {
    if (isEditMode) {
      if (active === 1) {
        updatePatientData();
      } else if (active === 2) {
        saveHealthData();
      }
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/patients/${id}`, { mode: 'cors' });
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        
        } else {
          console.error('Failed to fetch patient info');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchHealthData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/health/${id}`, { mode: 'cors' });
        if (response.ok) {
          const healthData = await response.json();
          setHealthData(healthData);
          setHealth_id(healthData.id);
        } else {
          console.error('Failed to fetch health data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
      fetchHealthData();
    fetchPatientInfo();
  }, [id]);

  const saveHealthData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/health/${health_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(HealthData)
        });
      if (response.ok) {
        console.log("Health data saved successfully");
        alert("Health data saved successfully");
      } else {
        console.error("Failed to save health data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updatePatientData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // LOG THE URL
      console.log(response.url);
      if (response.ok) {
        console.log("Patient data updated successfully");
      } else {
        console.error("Failed to update patient data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleContactinfo = () => {
    setActive(1);
    setContactinfovisible(true);
    setHealthinfovisible(false);
  };

  const toggleHealthinfo = () => {
    setActive(2);
    setHealthinfovisible(true);
    setContactinfovisible(false);
  };

    const inputStyle = {
    border: "none",
    borderBottom: isEditMode ? "2px solid #1463f3" : "none",
    width: "100%",
    marginBottom: "10px",
    fontSize: "16px",
    padding: "5px",
    backgroundColor: isEditMode ? "white" : "transparent",
    readOnly: !isEditMode
  };

  // Function to navigate to HealthData component
  const navigateToHealthData = () => {
    navigate(`/health-table/${id}`, { state: { id } });
  };

  const navigateToCvdPrediction = () => {
    navigate(`/prediction/${id}`, { state: { id } });
  }

  return (
    <div className="user-profile">
      <aside className="sidebar">
        {/* Sidebar navigation */}
        <h2>User Profile</h2>
        <button className={`${active === 1 && "active"}`} onClick={toggleContactinfo}>Contact Information</button>
        <button className={`${active === 2 && "active"}`} onClick={toggleHealthinfo}>Health Information</button>
        <button onClick={() => navigate('/')}>Back</button>
      </aside>

      <main className="profile-content">
        <div className="general-info">
          <Avatar sx={{ width: 130, height: 130 }} src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" />
          <div className='general-info-text'>
            <h4>{formData.first_name} {formData.last_name}</h4>
            <p>Age: {formData.Age} </p>
            <p>Gender: {HealthData.gender}</p>
          </div>
        </div>

        {Contactinfovisible && (
          <div className="contactsinfo-section">
            <div className='form'>
              {/* First Name */}
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>

              {/* Age */}
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label>Phone number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormDataChange}
                  style={inputStyle}
                  readOnly={!isEditMode}
                />
              </div>
            </div>
            <div>
              <button onClick={handleSaveChanges} className={`edit-save-btn ${isEditMode ? 'save-mode' : 'edit-mode'}`}>
                {isEditMode ? "Save Changes" : "Edit"}
              </button>
            </div>
          </div>
        )}


        {Healthinfovisible 
        && ( 
            // {healthDataExists ? ( 
              <div className="healthinfo-section">
                <h2>Health Information</h2>
                    <div>
                      {/* Health Information Fields */}
                      <div className="form-group">
                        <label>Gender:</label>
                        <select
                          name="gender"
                          value={HealthData.gender}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>

                      {/* Repeat for each health information field */}
                      <div className="form-group">
                        <label>Height (cms):</label>
                        <input
                          type="number"
                          name="height"
                          value={HealthData.height}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label>Weight (kgs):</label>
                        <input
                          type="number"
                          name="weight"
                          value={HealthData.weight}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label>Systolic Blood Pressure (ap_hi):</label>
                        <input
                          type="number"
                          name="systolic_bp"
                          value={HealthData.systolic_bp}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label>Diastolic Blood Pressure (ap_lo):</label>
                        <input
                          type="number"
                          name="diastolic_bp"
                          value={HealthData.diastolic_bp}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          readOnly={!isEditMode}
                        />
                      </div>

                      {/* BMI (read-only) */}
                      <div className="form-group">
                        <label>BMI:</label>
                        <input
                          type="text"
                          name="BMI"
                          value={HealthData.BMI}
                          readOnly // BMI is read-only
                          style={inputStyle}
                        />
                      </div>

                      {/* Alcohol Level */}
                      <div className="form-group">
                        <label>Alcohol level:</label>
                        <select
                          name="alcohol"
                          value={HealthData.alcohol}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="1">Alcoholic</option>
                          <option value="2">Non-Alcoholic</option>
                        </select>
                      </div>

                      {/* Activity Level */}
                      <div className="form-group">
                        <label>Activity level:</label>
                        <select
                          name="activity_level"
                          value={HealthData.activity_level}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="0">Inactive</option>
                          <option value="1">Active</option>
                        </select>
                      </div>

                      {/* Smoking Level */}
                      <div className="form-group">
                        <label>Smoking level:</label>
                        <select
                          name="smoking"
                          value={HealthData.smoking}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="0">Non-Smoker</option>
                          <option value="1">Smoker</option>
                        </select>
                      </div>

                      {/* Glucose Level */}
                      <div className="form-group">
                        <label>Glucose Level:</label>
                        <select
                          name="glucose_level"
                          value={HealthData.glucose_level}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="0">Normal</option>
                          <option value="1">Above Normal</option>
                          <option value="2">Well Above Normal</option>
                        </select>
                      </div>

                      {/* Cholesterol Level */}
                      <div className="form-group">
                        <label>Cholesterol level:</label>
                        <select
                          name="cholesterol_level"
                          value={HealthData.cholesterol_level}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="0">Normal</option>
                          <option value="1">Above Normal</option>
                          <option value="2">Well Above Normal</option>
                        </select>
                      </div>

                      {/* Presence of CVD */}
                      <div className="form-group">
                        <label>Presence of CVD:</label>
                        <select
                          name="cardio"
                          value={HealthData.cardio}
                          onChange={handleHealthDataChange}
                          style={inputStyle}
                          disabled={!isEditMode}
                        >
                          <option value="0">Has no CVD</option>
                          <option value="1">Has CVD</option>
                        </select>
                      </div>
                    </div>
                      <div>
                        <button onClick={handleSaveChanges} className={`edit-save-btn ${isEditMode ? 'save-mode' : 'edit-mode'}`}>
                          {isEditMode ? "Save Changes" : "Edit"}
                        </button>
                        <button onClick={navigateToCvdPrediction} className="add-health-info-btn">Make a prediction</button>
                      </div>;
              </div>
            // ) : (
              // <div className="add-health-info">
              //   <button onClick={navigateToHealthData}>Add Health Details</button>
              // </div>
            )}
          {/* </> */}
        {/* )} */}
      </main>
    </div>
  );
};

export default UserProfile;


