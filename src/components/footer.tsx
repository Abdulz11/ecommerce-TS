

function Footer() {
  return (
    <div className="footer-div">
        <div className="footer-logo">
            Shop & Drop
        </div>
        <div className="footer-links">
            <ul>
                <li>
                    <a href="#">Home</a>
                </li>
                <li>
                 <a href="#categories">Categories</a>
                </li>
                <li>
                   <a href="#products">Products</a>
                </li>
            </ul>
        </div>

        <div className="footer-contact">
            <div>
                <i className="bi-instagram" ></i>
                <span>Instagram</span>
            </div>
            <div>
                <i className="bi-twitter" ></i>
                <span>Twitter</span>
            </div>
            <div>
                <i className="bi-facebook" ></i>
                <span>Facebook</span>
            </div>
           
        </div>
    </div>
  )
}

export default Footer