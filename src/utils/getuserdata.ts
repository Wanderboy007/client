const getUserFromLocalStorage = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

export default getUserFromLocalStorage;