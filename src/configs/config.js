const config = {
    
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    //API_BASE_URL: 'http://127.0.0.1:5000',
    test: 'process.env.REACT_APP_API_BASE_URL'
  };
  console.log("API_BASE_URL:", config.API_BASE_URL); // Debugging line
  console.log("API_BASE_URL:", config.test); // Debugging line
export default config;
  