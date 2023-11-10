import { useState, useEffect, createContext, useContext } from 'react';

const PatientDataContext = createContext();

export function usePatientData() {
  return useContext(PatientDataContext);
}

export default function PatientDataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/patients', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (response.status === 200) {
          const result = await response.json();
          setData(result);
          // console.log('Data fetched successfully');
          // console.log(result);
        } else {
          console.log('Request failed with status code:', response.status);
          setError('Request failed with status code: ' + response.status); // Set error state
        }
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        setError('An error occurred: ' + error.message); // Set error state
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <PatientDataContext.Provider value={{ data, setData, error }}> {/* Include error state */}
      {children}
    </PatientDataContext.Provider>
  );
}
