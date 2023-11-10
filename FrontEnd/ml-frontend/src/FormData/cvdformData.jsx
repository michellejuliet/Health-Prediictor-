import { useState, useEffect } from "react";
import './cvdformData.css';

const calculateBMI = (weight, height) => {
  if (weight && height) {
    const height_s = height / 100;
    return (weight / (height_s * height_s)).toFixed(1);
  } else {
    return "";
  }
};

function DataFields() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    Age: "",
    address: "",
    gender: "",
    height: "",
    weight: "",
    alcohol: "",
    smoking: "",
    // blood_pressure: "",
    diastolic_bp: "",
    systolic_bp: "",
    BMI: "",
    BMI_category: "",
    activity_level: "",
    glucose_level: "",
    cholesterol_level: "",
  });

  // const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true); // Initially, set email as valid

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };


  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "height" || name === "weight") {
    const updatedData = {
      ...formData,
      [name]: value !== undefined ? value : "", 
      BMI: calculateBMI(
        name === "weight" ? value : formData.weight,
        name === "height" ? value : formData.height
      ),
    };
    setFormData(updatedData);

    console.log("Updated Data: ", updatedData);

    // Calculate and set the BMI category based on the updated BMI value
    const bmi = calculateBMI(
      name === "weight" ? value : formData.weight,
      name === "height" ? value : formData.height
    );

    if (bmi) {
      if (bmi < 18.5) {
        updatedData.BMI_category = "underweight";
      } else if (bmi >= 18.5 && bmi <= 25) {
        updatedData.BMI_category = "normal";
      } else if (bmi > 25 && bmi <= 30) {
        updatedData.BMI_category = "overweight";
      } else if (bmi > 30) {
        updatedData.BMI_category = "obese";
      }
    }

    if (name === "email") {
      // Validate email
      const isValid = validateEmail(value);
      setIsEmailValid(isValid);
    }

    setFormData(updatedData);
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  useEffect(() => {
    // Recalculate BMI when height or weight changes
    const { weight, height } = formData;
    const bmi = calculateBMI(weight, height);
    setFormData((prevData) => ({ ...prevData, BMI: bmi }));
    // console.log("BMI:", bmi);
    // console.log("BMI Category:", formData.BMI_category);
    // console.log("height", formData.height);
    // console.log("weight", weight);
    // console.log("gender", formData.gender);
  }, [formData.weight, formData.height]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Log the form data for debugging (optional)
  console.log(formData);

  // Send a POST request to the server with JSON data
  const response = await fetch("http://127.0.0.1:5000/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData), // Convert form data to JSON
  });

  // Handle the response as needed (e.g., check for success or errors)
  if (response.ok) {
    // Successful response (status code 2xx)
    const responseData = await response.json();
    console.log("Data successfully posted:", responseData);
  } else {
    // Handle errors (status code is not 2xx)
    console.error("Error posting data:", response.statusText);
  }

  // Clear the form fields after submission
  setFormData({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    Age: "",
    address: "",
    gender: "",
    height: "",
    weight: "",
    alcohol: "",
    smoking: "",
    // blood_pressure: "",
    diastolic_bp: "",
    systolic_bp: "",
    BMI: "",
    BMI_category: "",
    activity_level: "",
    glucose_level: "",
    cholesterol_level: "",
  });
};
 


  return (
      <div className="cvd-page">
      <h1>CVD Patient Information Form</h1>
      <form>
       <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ borderColor: isEmailValid ? "green" : "red" }} // Change border color based on email validity
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Female">Female</option>
            {/* <option value="2">Male</option> */}
            <option value="Male">Male</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone number:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              name="phone_number"
              value="+254"
              readOnly // Make the prefix read-only
              style={{ width: "50px", marginRight: "3px" }} // Adjust the width and margin
            />
            <input
              type="text" // Use text type for the actual phone number
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone number"
              maxLength="9" // limit numbers to 9
            />
          </div>
        </div>


        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Height (cms):</label>
          <input
            type="number" 
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Weight (kgs):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Systolic Blood Pressure (ap_hi):</label>
          <input
            type="number"
            name="systolic_bp"
            value={formData.systolic_bp}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Diastolic Blood Pressure (ap_lo):</label>
          <input
            type="number"
            name="diastolic_bp"
            value={formData.diastolic_bp}
            onChange={handleChange}
          />
        </div>


         <div className="form-group">
          <label>BMI:</label>
          <input
            type="text"
            name="BMI"
            value={formData.BMI}
            // onChange={handleChange}
            readOnly // Make BMI input read-only
          />
        </div>

         <div className="form-group">
          <label>BMI Category:</label>
          <input
            type="text"
            name="BMI_category"
            value={formData.BMI_category}
            // onChange={handleChange}
            readOnly // Make BMI category input read-only
          />
        </div>

        <div className="form-group">
            <label>Alcohol level:</label>
            <select
              name="alcohol"
              value={formData.alcohol}
              onChange={handleChange}
            >
              <option value="0">Alcoholic</option>
              <option value="1">Non-Alcoholic</option>
            </select>
        </div>

         <div className="form-group">
          <label>Activity level:</label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
          >
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>
        </div>

         <div className="form-group">
          <label>Smoking level:</label>
          <select
            name="smoking"
            value={formData.smoking}
            onChange={handleChange}
          >
            <option value="0">Non-Smoker</option>
            <option value="1">Smoker</option>
          </select>
        </div>

         <div className="form-group">
          <label>Glucose Level:</label>
          <select
            name="glucose_level"
            value={formData.glucose_level}
            onChange={handleChange}
          >
            <option value="0">Normal</option>
            <option value="1">Above Normal</option>
            <option value="2">Well Above Normal</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cholestrol level:</label>
          <select
            name="cholesterol_level"
            value={formData.cholesterol_level}
            onChange={handleChange}
          >
            <option value="0">Normal</option>
            <option value="1">Above Normal</option>
            <option value="2">Well Above Normal</option>
          </select>
        </div>

        <div className="form-group">
          <label>Presence of CVD:</label>
          <select
            name="cardio"
            value={formData.cardio}
            onChange={handleChange}
          >
            <option value="0">Has no CVD</option>
            <option value="1">Has CVD</option>
          </select>
        </div>
      </form>
      <br />
      <div className="buttons">
      <a href='/'>
      <button type="button">
          Back
        </button>
        </a>
       <button type="submit" onClick={handleSubmit}  >
          Submit
        </button>
      </div>
    </div>
  );
}


export default DataFields;
