import { useState, useEffect } from "react";
import './cvdformData.css';
// import { useParams } from 'react-router-dom';


function DataFields() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    Age: "",
    address: "",
    // gender: "",
  });

  //  const [hospitalId, setHospitalId] = useState(null);
  // const id = useParams();

  useEffect(() => {
    // Fetch the hospital ID
    fetch('http://127.0.0.1:5000/api/hospitals')
      .then(response => response.json())
      .then(data => {
        console.log('Hospital ID:', data.id);
        // const id = data.id; // Replace with the actual path to the ID in your response data
        // setHospitalId(id);
      })
      .catch(error => {
        console.error('Error fetching hospital ID:', error);
      });
  }, []);

 const postData = async () => {
  // if (hospitalId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/5a675cb3-f1a0-41db-9dff-93f746f380c7/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, such as Authorization
        },
        body: JSON.stringify(formData), // Send the formData as the request payload
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        // Handle the response data
        console.log(data);

        // Clear the form fields after successful submission
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          Age: "",
          address: "",
          // ... reset other fields as necessary
        });

        // Optionally, display a success message or navigate to another page
        alert('Patient data submitted successfully!');
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
//   } else {
//     alert('No hospital ID found. Please try again.');
//   }
};


    const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false);

  // const [isEmailValid, setIsEmailValid] = useState(true); // Initially, set email as valid

  // const validateEmail = (email) => {
  //   // Regular expression for basic email validation
  //   const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  //   return emailPattern.test(email);
  // };
  
 

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
            // style={{ borderColor: isEmailValid ? "green" : "red" }} // Change border color based on email validity
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

      </form>
      <br />
      <div className="buttons">
      <a href='/'>
      <button type="button">
          Back
        </button>
        </a>
       <button type="submit" onClick={postData}  >
          Submit
        </button>
      </div>
    </div>
  );
}


export default DataFields;
