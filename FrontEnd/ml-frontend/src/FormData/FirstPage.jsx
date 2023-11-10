// import 'bootstrap/dist/css/bootstrap.min.css';
import './FirstPage.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import {useNavigate} from 'react-router-dom';

const calculateBMI = (weight, height) => {
  if (weight && height) {
    const height_s = height / 100;
    return (weight / (height_s * height_s)).toFixed(1);
  } else {
    return "";
  }
};

const UserProfile = () => {
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

    //   const [userData, setUserData] = useState(null);
      const { id } = useParams(); // Get the ID from the URL
      const navigate = useNavigate(); // Hook for navigation
      const [isEmailValid, setIsEmailValid] = useState(true); // Initially, set email as valid

    const validateEmail = (email) => {
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

    // Track changes
    setChangesMade(true);
  } else {
    setFormData({ ...formData, [name]: value });

    // Track changes
    setChangesMade(true);
  }

  if (name === "email") {
    const isValid = validateEmail(value);
    setIsEmailValid(isValid);
  }
};

    const [Contactinfovisible, setContactinfovisible] = useState(true);
    const [Healthinfovisible, setHealthinfovisible] = useState(false);
    const [active, setActive] = useState(1);

    const toggleContactinfo = () => {
        setContactinfovisible(!Contactinfovisible);
        setHealthinfovisible(false);
        setActive(1);
    }

    const toggleHealthinfo = () => {
        setHealthinfovisible(!Healthinfovisible);
        setContactinfovisible(false);
        setActive(2);
    }

    const [isEditMode, setIsEditMode] = useState(false);
    const [changesMade, setChangesMade] = useState(false); // Track changes made to the form

    const inputStyle = {
        border: isEditMode ? "1px solid #ccc" : "none", // Border appears only in edit mode
        outline: "none", // Remove default focus outline
        padding: "5px", // Add some padding for better appearance
        backgroundColor: isEditMode ? "white" : "transparent", // Set background only in edit mode
    };

    const updateUserData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/patients/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("User data updated successfully");
                // Additional logic after successful update (if required)
            } else {
                console.error("Failed to update user data");
                // Handle errors
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle errors
        }
    };

    const toggleEditMode = () => {
    if (isEditMode) {
        // If currently in edit mode, save changes
        updateUserData();
    }
    setIsEditMode(!isEditMode); // Toggle the edit mode state
    setChangesMade(false); // Reset the changes made state
};


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/patients/' + id, { mode: 'cors' });
                // console.log(id);
                // console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    setFormData(data); // Assuming the response is a single user object
                } else {
                    console.error('Failed to fetch');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!formData) {
        return <p>Loading...</p>;
    }
    const age = formData.Age;
    // const alcohol = formData.alcohol;
    // const cholesterol_level = formData.cholesterol_level;
    // const glucose_level = formData.glucose_level;
    // const smoking = formData.smoking;
    // const address = formData.address;
    const gender = formData.gender;
    // const height = formData.height;
    // const weight = formData.weight;
    const systolic_bp = formData.systolic_bp;
    const diastolic_bp = formData.diastolic_bp;
    const BMI = formData.BMI;
    const BMI_category = formData.BMI_category;
    const email = formData.email;
    const phone_number = formData.phone_number;
    const first_name = formData.first_name;
    const last_name = formData.last_name;
    // const active = formData.activity_level;
    // const gender = formData.gender;

    return (
        <div className="user-profile">
      <aside className="sidebar">
        {/* Sidebar navigation */}
        <h2>User Profile</h2>
        <button className={`${active==1 && "active"}`} onClick={toggleContactinfo}>Contact Information</button>
        <button className={`${active==2 && "active"}`} onClick={toggleHealthinfo}>Health Information</button>
          <button onClick={() => navigate('/')}>
            Back</button>
      </aside>

      <main className="profile-content">
        <div className="general-info">
            <Avatar sx={{ width: 130, height: 130 }} src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" />
            <div className='general-info-text'>
            <h4>{first_name} {last_name}</h4>
            <p>Age: {age} </p>
            <p> Gender: {gender}</p>
            </div>
        </div>

        {Contactinfovisible && (<div className="contactsinfo-section">
          <div className='form'>
          <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={first_name}
            // onChange={handleChange}
            style={inputStyle}
            readOnly
          />
        </div>

          <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={last_name}
            style={inputStyle}
            // onChange={handleChange}
            readOnly
          />
        </div>

         <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            style={inputStyle}
            // readOnly={!isEditMode}
            // style={{ borderColor: isEmailValid ? "green" : "red" }} // Change border color based on email validity
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            style={inputStyle}
            // readOnly={!isEditMode}
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
              // style={inputStyle}
              // readOnly // Make the prefix read-only
              onChange={handleChange}
              style={{ width: "30px", marginRight: "3px" , inputStyle}} // Adjust the width and margin
            />
            <input
              type="text" // Use text type for the actual phone number
              name="phone_number"
              value={phone_number}
              // readOnly={!isEditMode}
              onChange={handleChange}
              placeholder="Phone number"
              maxLength="9" // limit numbers to 9
              style={{ width: "70px", inputStyle}} // Adjust the width
            />
          </div>

        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        </div>
         <div>
          <button  onClick={toggleEditMode}
            style={{ backgroundColor: changesMade ? "#1463f3" : "#84A4FC"  }}
            >{isEditMode ? "Save Changes" : "Edit"}</button>
          </div>
        </div>
)}

        {Healthinfovisible && (<div className="healthinfo-section">
          <h2 
          >Health Information</h2>
          <div>
        <div className="form-group">
          <label>Height (cms):</label>
          <input
            type="number" 
            name="height"
            value={formData.height}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

         <div className="form-group">
          <label>Weight (kgs):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div className="form-group">
          <label>Systolic Blood Pressure (ap_hi):</label>
          <input
            type="number"
            name="systolic_bp"
            value={formData.systolic_bp}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div className="form-group">
          <label>Diastolic Blood Pressure (ap_lo):</label>
          <input
            type="number"
            name="diastolic_bp"
            value={formData.diastolic_bp}
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
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
            style={inputStyle}
          />
        </div>

         <div className="form-group">
          <label>BMI Category:</label>
          <input
            type="text"
            name="BMI_category"
            value={formData.BMI_category}
            // onChange={handleChange}
            readOnly// Make BMI category input read-only
            style={inputStyle}
          />
        </div>

        <div className="form-group">
            <label>Alcohol level:</label>
            <select
              name="alcohol"
              value={formData.alcohol}
              // readOnly={!isEditMode}
              onChange={handleChange}
              style={inputStyle}
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
            // readOnly={!isEditMode}
            style={inputStyle}
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
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
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
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
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
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
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
            // readOnly={!isEditMode}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="0">Has no CVD</option>
            <option value="1">Has CVD</option>
          </select>
        </div>
            </div>
            <p>BMI: {BMI} ({BMI_category})</p>
          <p>Blood Pressure: {systolic_bp}/{diastolic_bp} mmHg</p>
          <button  onClick={toggleEditMode}
            style={{ backgroundColor: changesMade ? "#1463f3" : "#84A4FC"}}
            >{isEditMode ? "Save Changes" : "Edit"}</button>
        </div>)}
      </main>
    </div>
    );
};

export default UserProfile;
