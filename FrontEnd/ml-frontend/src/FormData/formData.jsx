import { useState } from "react";
import './formData.css';

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
    blood_pressure: "",
    BMI: "",
    BMI_category: "",
    activity_level: "",
    glucose_level: "",
    cholesterol_level: "",
  });

  const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every((value) => value !== "");
    setSubmitButtonVisible(allFieldsFilled);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Log the form data for debugging (optional)
  console.log(formData);

  // Send a POST request to the server with JSON data
  const response = await fetch("http://192.168.1.12:5000/api/patients", {
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
    blood_pressure: "",
    BMI: "",
    BMI_category: "",
    activity_level: "",
    glucose_level: "",
    cholesterol_level: "",
  });
};

  const handleSave = async (e) => {
    e.preventDefault();

    // Here, you can send the data to your API for saving it to a database
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    try {
      const response = await fetch("http://192.168.1.12:5000/api/patients", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Data successfully saved.");
      } else {
        console.error("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }

    // set the form data to the filled values
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
    blood_pressure: "",
    BMI: "",
    BMI_category: "",
    activity_level: "",
    glucose_level: "",
    cholesterol_level: "",
  });
  };

  return (
      <div className="App">
      <h1>Patient Information Form</h1>
      <form>
        {/* ... (other input fields) */}
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
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
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
          <input
            type="number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Height:</label>
          <input
            type="text" 
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Weight:</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Alcohol level:</label>
          <input
            type="text"
            name="alcohol"
            value={formData.alcohol}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Smoking level:</label>
          <input
            type="text"
            name="smoking"
            value={formData.smoking}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Blood Pressure level:</label>
          <input
            type="text"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>BMI:</label>
          <input
            type="text"
            name="BMI"
            value={formData.BMI}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>BMI Category:</label>
          <input
            type="text"
            name="BMI_category"
            value={formData.BMI_category}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Activity level:</label>
          <input
            type="text"
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
          />
        </div>

         <div className="form-group">
          <label>Glucose Level:</label>
          <input
            type="text"
            name="glucose_level"
            value={formData.glucose_level}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cholestrol level:</label>
          <input
            type="text"
            name="cholesterol_level"
            value={formData.cholesterol_level}
            onChange={handleChange}
          />
        </div>

        <button type="button" onClick={handleSave} disabled={isSubmitButtonVisible}>
          Save
        </button>
        <button type="button" onClick={handleSubmit}  >
          Submit
        </button>
      </form>
    </div>
  );
}


export default DataFields;
