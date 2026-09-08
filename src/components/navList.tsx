import styles from "./navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { cartImage } from "../assets/images/cartImage";
import { useState } from "react";
import { fetchData } from "../lib/api";

export default function NavList() {
  const navigate = useNavigate();

  const { accessToken, userInfo, setAccessToken } = useAuthContext();
  const [cart, setCart] = useState([]);
  const userName = userInfo?.name || "User";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await fetchData("/user/logout", "POST");
      // Remove frontend access token
      localStorage.removeItem("accessToken");
      setAccessToken("");
      navigate("/");
      setCart([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <div className={styles.linkDiv}>
        <Link to='/' className={styles.navLink}>
          Home
        </Link>
        {!accessToken && (
          <Link to='/signin' className={styles.navLink}>
            Sign-in
          </Link>
        )}
        {accessToken && (
          <Link to='/profile' className={styles.navLink}>
            Profile
          </Link>
        )}
        {accessToken && (
          <div className={`${styles.userBadgeGroup} ms-2`} title={userName}>
            <div
              className={`d-inline-flex align-items-center justify-content-center ${styles.userAvatar}`}
            >
              {initials}
            </div>
            <span className='ms-2 text-muted small d-none d-sm-inline'>
              Welcome, {userName}
            </span>
            <span className='ms-2 text-muted small d-inline d-sm-none'>
              Hi, {initials}
            </span>
          </div>
        )}
        {accessToken && userInfo?.role == "STORE" && (
          <Link to='/upload' className={styles.navLink}>
            Upload
          </Link>
        )}
        {accessToken && (
          <button
            type='button'
            onClick={handleLogout}
            className={`${styles.navLink} ${styles.logoutButton}`}
          >
            Logout
          </button>
        )}
      </div>
      {userInfo?.role === "CUSTOMER" && (
        <div className={styles.cartDiv}>
          <img
            src={cartImage}
            alt='shopping cart'
            className={styles.cartImage}
          />
          {cart.length > 0 ? (
            <span className={styles.cartBadge}>{cart.length}</span>
          ) : null}
        </div>
      )}
    </>
  );
}
