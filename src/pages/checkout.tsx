


export default function Checkout() {
  return (
    <>
    <div style={{textAlign:'center',marginBottom:'5rem'}}>
    <h1>Shop & Drop</h1>
    </div>
    <form action="">
    <div className="checkout-container">
        <div className="checkout-fields">
            <label htmlFor="">Name</label>
            <input type="text" />
        </div>
        <div className="checkout-fields">
            <label htmlFor="">Address</label>
            <input type="text" />
        </div>
        <div className="checkout-fields">
            <label htmlFor="">Phone</label>
            <input type="text" />
        </div>
        <div className="checkout-fields">
            <label htmlFor="">Location</label>
            <input type="text" />
        </div>
      </div>
   </form>
  </>
  )
}

