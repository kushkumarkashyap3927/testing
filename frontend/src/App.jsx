import React, { useEffect } from 'react'

import { Toaster } from 'sonner';
import axios from 'axios';

function App() {

  const[homeData, setHomeData] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL);
        console.log('Home data:', response.data);
        setHomeData(response.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, []);
  return (
  <>
    <h1>{homeData?.message || 'the Home Page'}</h1>
    <Toaster /> 
  </>
  )
}

export default App