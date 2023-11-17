import { useState, useEffect } from 'react';
import './prediction.css';
// import { useParams } from 'react-router-dom';

const PredictionPage = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const patientId = "4132641b-e381-4fc1-8fb2-c7f4f2c6e2f9";
    // const { patientId } = useParams();

  useEffect(() => {
    // Fetch patient information on component mount
    fetch(`http://127.0.0.1:5000/api/patients/ml/${patientId}`)
      .then(response => response.json())
      .then(data => setPatientInfo(data))
      .catch(error => console.error('Error fetching patient data:', error));
  }, [patientId]);

  const handlePredict = () => {
    fetch(`http://127.0.0.1:5000/api/patients/predict/${patientId}`)
      .then(response => response.json())
      .then(data => setPrediction(data.prediction))
      .catch(error => console.error('Error fetching prediction:', error));
  };

  const ageGroup = (age) => {
    let ageGroup = "";
    if (age < 40) {
        ageGroup = "Young";
    } else if (age >= 40 && age < 60) {
        ageGroup = "Adult";
    } else {
        ageGroup = "Senior";
    }
    return ageGroup;
}

    const active = (active) => {
        let activity = "";
        if (active === 1) {
            activity = "Yes";
        } else {
            activity = "No";
        }
        return activity;
    }

   const alcoholic = (alcohol) => {
    let alcoholicStatus = "";
    if (alcohol === 1) {
        alcoholicStatus = "Alcoholic";
    } else if (alcohol === 2) {
        alcoholicStatus = "Non-alcoholic";
    } else {
        alcoholicStatus = "Unknown"; // or any other default value you prefer
    }
    return alcoholicStatus;
}


    const bpCategory = (ap_hi, ap_lo) => {
        let bpCategory = "";
        if (ap_hi < 120 && ap_lo < 80) {
            bpCategory = "Normal";
        } else if (ap_hi >= 140 || ap_lo >= 90) {
            bpCategory = "Hypertension";
        } else {
            bpCategory = "High-Normal";
        }
        return bpCategory;
    }

    const bmiCategory = (bmi) => {
        let bmiCategory = "";
        if (bmi < 18.5) {
            bmiCategory = "Underweight";
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiCategory = "Normal";
        } else if (bmi >= 25 && bmi < 30) {
            bmiCategory = "Overweight";
        } else {
            bmiCategory = "Obese";
        }
        return bmiCategory;
    }

    const cardiostatus = (cardio) => {
        let cardiostatus = "";
        if (cardio === 1) {
            cardiostatus = "Has CVD";
        } else {
            cardiostatus = "No CVD";
        }
        return cardiostatus;
    }

    const cholesterol_level = (cholesterol) => {
        let cholesterol_level = "";
        if (cholesterol === 0) {
            cholesterol_level = "Normal";
        } else if (cholesterol === 1) {
            cholesterol_level = "Above Normal";
        } else if (cholesterol === 2) {
            cholesterol_level = "Well Above Normal";
        } else {
            cholesterol_level = "Not defined";
        }
        return cholesterol_level;
    }

    const glucose_level = (glucose) => {
        let glucose_level = "";
        if (glucose === 0) {
            glucose_level = "Normal";
        } else if (glucose === 1) {
            glucose_level = "Above Normal";
        } else if (glucose === 2) {
            glucose_level = "Well Above Normal";
        } else {
            glucose_level = "Not defined";
        }
        return glucose_level;
    }

    const smoker = (smoke) => {
        let smoker = "";
        if (smoke === 1) {
            smoker = "Non Smoker";
        } else if (smoke === 2) {
            smoker = "smoker";
        } else {
            smoker = "Not defined";
        }
        return smoker;
    }

  return (
    <div className="prediction-page">
      <h1>Patient Health Prediction</h1>
      {patientInfo && (
        <div className="patient-info">
          <p>Age: {patientInfo.age}</p>
          <p>Age-group: {ageGroup(patientInfo.age)}</p>
          <p>Active: {active(patientInfo.active)}</p>
            <p>Alcohol: {alcoholic(patientInfo.alco)}</p>
            <p>Height: {patientInfo.height} cms</p>
            <p>Weight: {patientInfo.weight} kgs</p>
            <p>Diastolic-bp: {patientInfo.ap_lo}</p>
            <p>Systolic-bp: {patientInfo.ap_hi}</p>
            <p>Bp category: {bpCategory(patientInfo.ap_hi, patientInfo.ap_lo)} </p>
            <p>BMI: {patientInfo.bmi} </p>
            <p>BMI category: {bmiCategory(patientInfo.bmi)}</p>
            <p>Cholesterol: {cholesterol_level(patientInfo.cholesterol)}</p>
            <p>Glucose: {glucose_level(patientInfo.gluc)}</p>
            <p>Smoking: {smoker(patientInfo.smoke)}</p>
            <p>Cardio :{cardiostatus(patientInfo.cardio)}</p>
         </div>
      )}
      <button onClick={handlePredict}>Predict Health Outcome</button>
      {prediction && (
        <div className="prediction-result">
          <h2>Prediction: {prediction}</h2>
          <p>{prediction === "Likely" ? "Stay hopeful and keep maintaining a healthy lifestyle." : "Great! Keep up the good health practices."}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;

// Add your CSS for styling and responsiveness
