import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    user_mispar_ishi: "",
  });

  const [isFormValid, setIsFormValid] = useState({
    userName: true,
    personalNumber: true,
  });

  const navigation = () => {
    navigate("/home");
  }

  useEffect(() => {
    async function login() {
      const localStorageInfo = JSON.parse(localStorage.getItem("userInfo"));

      if(localStorageInfo) {
        try{
          await api().login(localStorageInfo);
          navigation();
        } catch {
          console.log("error");
        }
      }
    }

    login();
  }, []);

  const handleCahnge = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => {
      return {
        ...prevUserInfo,
        [name]: value,
      };
    });
  };

  const checkUserInfo = async (event) => {
    event.preventDefault();
    const userNameRegex = /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z]*\d{0,3}$/;
    const personalNumberRegex = /^\d{7}$/;

    const isUserNameValid = userNameRegex.test(userInfo.user_name);
    const isPersonalNumberValid = personalNumberRegex.test(
      userInfo.user_mispar_ishi
    );

    setIsFormValid({
      userName: isUserNameValid,
      personalNumber: isPersonalNumberValid,
    });

    if (isUserNameValid && isPersonalNumberValid) {
      try {
        const response = await api().login(userInfo);

        if (response.status = 200) {
          const user = await response.data;
          localStorage.setItem("userInfo", JSON.stringify(user));
          navigation();
        } else {
          console.error("Login failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error while login:", error);
      }
    }
  };

  return (
    <form className="register-form">
      <input
        className="register-input"
        placeholder="שם משתמש"
        value={userInfo.user_name}
        name="user_name"
        onChange={handleCahnge}
        required
      />
      {!isFormValid.userName && (
        <span className="error">שם המשתמש לא חוקי</span>
      )}
      <input
        className="register-input"
        placeholder="מספר אישי"
        value={userInfo.user_mispar_ishi}
        name="user_mispar_ishi"
        onChange={handleCahnge}
        required
      />
      {!isFormValid.personalNumber && (
        <span className="error">מספר אישי לא חוקי</span>
      )}
      <button onClick={checkUserInfo} className="register-button">
        אישור
      </button>
    </form>
  );
}
