import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './users.css';
import { useNavigate } from 'react-router-dom';
import { customStyles } from '../customStyles';

const url = 'http://127.0.0.1:5000/api/patients';

let headers = {
    "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache"
};

export default function UserData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { headers });

        if (response.status === 200) {
          const result = await response.json();
          setData(result);
          setLoading(false);
        } else {
          console.log('Request failed with status code:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    fetchData();
  }, []);

  // Function to handle row click
  const handleRowClick = (row) => {
    // Navigate to the user's profile page with the user's ID in the URL
    navigate(`/profile/${row.id}`);
  };


  const columns = [
    {
      name: 'Name',
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      // sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.address,
      // sortable: true,
    },
    {
      name: 'Age',
      selector: row => row.Age,
      // sortable: true,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      // sortable: true,
    },
  ];

  return (
    <div>
      <h1>All Users</h1>
        <div className="dataholder">
          <DataTable
            columns={columns}
            data={data}
            onRowClicked={handleRowClick}
            progressPending={loading}
            customStyles={customStyles}
            progressComponent={<h2>Loading...</h2>}
          />
        </div>
        <a href='/cvd-table'>
            <button className="navbar-toggler" type="button">
              Add New Patient</button>
        </a>
  </div>
  );
}
