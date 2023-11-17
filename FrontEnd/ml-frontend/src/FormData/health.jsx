import './health.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const HealthData = () => {
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


   const postData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${id}/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, such as Authorization
        },
        body: JSON.stringify(HealthData), // Send the formData as the request payload
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        // Handle the response data
        console.log(data);

        // Clear the form fields after successful submission
        setHealthData({
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

        /// Display a success message
      alert('Patient Health data submitted successfully!');

      // Navigate back to home page
      navigateHome();
      } else {
        // If the server response was not ok, handle errors
        console.error('Failed to submit patient data. Status:', response.status);
        // Optionally, display an error message to the user
        alert('Failed to submit patient data.');
      }
    } catch (error) {
      console.error('Error posting patient data:', error);
      // Optionally, display an error message to the user
      alert('An error occurred while submitting patient data.');
    }
};

  const navigateHome = () => {
    navigate(`/`);
  }

  return (
    <div className="healthinfo">
          <div className="healthinfo-table">
            <h2>Health Information Form</h2>
            <form>
              {/* Health Information Fields */}
              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={HealthData.gender}
                  onChange={handleHealthDataChange}
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
                />
              </div>

              <div className="form-group">
                <label>Weight (kgs):</label>
                <input
                  type="number"
                  name="weight"
                  value={HealthData.weight}
                  onChange={handleHealthDataChange}
                />
              </div>

              <div className="form-group">
                <label>Systolic Blood Pressure (ap_hi):</label>
                <input
                  type="number"
                  name="systolic_bp"
                  value={HealthData.systolic_bp}
                  onChange={handleHealthDataChange}
                />
              </div>

              <div className="form-group">
                <label>Diastolic Blood Pressure (ap_lo):</label>
                <input
                  type="number"
                  name="diastolic_bp"
                  value={HealthData.diastolic_bp}
                  onChange={handleHealthDataChange}
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
                />
              </div>

              {/* Alcohol Level */}
              <div className="form-group">
                <label>Alcohol level:</label>
                <select
                  name="alcohol"
                  value={HealthData.alcohol}
                  onChange={handleHealthDataChange}
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
                
                >
                  <option value="0">Has no CVD</option>
                  <option value="1">Has CVD</option>
                </select>
              </div>
            </form>
            </div>
              <div className='buttons'>
                <button type="button" onClick={navigateHome} >
                    Back
                </button>
                <button type="submit" onClick={postData} >
                    Submit
                </button>
              </div>;
            </div>  
  )
}

export default HealthData;