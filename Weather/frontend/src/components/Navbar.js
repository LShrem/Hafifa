import React from "react";
import "../styles/Navbar.css";
import { NavLink } from 'react-router-dom'; 
 
const Navbar = () => {
    const logout = () => {
        localStorage.clear();
    }

    return (
        <nav>
            <ul>
                <li><NavLink to="/home" className="link">ראשי</NavLink></li>
                <li><NavLink to="/history">היסטוריה</NavLink></li>
                <li><NavLink to="/mador" className="link">מדור</NavLink></li>
                <li style={{float: "left"}}><NavLink to="/" onClick={logout}>התנתקות</NavLink></li>
            </ul>
        </nav>
    );
}
 
export default Navbar;