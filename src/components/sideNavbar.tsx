import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { cartImage } from "../assets/images/cartImage";
import styles from "./sideNavbar.module.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { fetchData } from "../lib/api";
import { useAppContext } from "../context/appContext";

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const { cart } = useAppContext();
  const { cart, setCart } = useAppContext();
  // console.log(useAppContext());
  const { accessToken, userInfo, setAccessToken } = useAuthContext();
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

      localStorage.removeItem("accessToken");
      setAccessToken("");
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={styles.hamburgerBtn}
        onClick={toggleSidebar}
        aria-label='Toggle menu'
      >
        <FaBars size={25} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
      )}

      {/* Side Navbar */}
      <nav className={`${styles.sideNavbar} ${isOpen ? styles.open : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label='Close menu'
        >
          <FaTimes size={20} />
        </button>

        <div className={styles.navLinks}>
          <Link
            to='/'
            className={styles.navLink}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {!accessToken && (
            <Link
              to='/signin'
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}

          {accessToken && (
            <Link
              to='/profile'
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          )}

          {accessToken && userInfo?.role === "STORE" && (
            <Link
              to='/upload'
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Upload Product
            </Link>
          )}
          {userInfo?.role == "CUSTOMER" && (
            <Link
              to='/cart'
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles.cartDiv}>
                <img
                  src={cartImage}
                  alt='shopping cart'
                  className={styles.cartImage}
                />
                {cart.length > 0 && (
                  <span className={styles.cartBadge}>{cart.length}</span>
                )}
              </div>
            </Link>
          )}

          {accessToken && (
            <div className={styles.userSection}>
              <div className={styles.userBadge}>
                <div className={styles.userAvatar}>{initials}</div>
                <div>
                  <p className={styles.userName}>{userName}</p>
                </div>
              </div>
              <button
                type='button'
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.logoutButton}`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default SideNavbar;
