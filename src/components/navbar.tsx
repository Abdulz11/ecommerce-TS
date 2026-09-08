import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "./logo";
import styles from "./navbar.module.css";
import SideNavbar from "./sideNavbar";
import NavList from "./navList";
import { useEffect, useState } from "react";

function Navbar() {
  const [mobileScreen, setMobileScreen] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setMobileScreen(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Nav className={`container p-2 mt-3 ${styles.navRoot} `}>
      <Logo />
      {mobileScreen ? <SideNavbar /> : <NavList />}
      <Link to='/cart' className={styles.navLink}></Link>
    </Nav>
  );
}

export default Navbar;
