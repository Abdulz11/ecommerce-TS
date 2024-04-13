import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/appcontext"
import { commerce } from "../../lib/commerce";
import { Bars } from "react-loader-spinner";


export default function PaymentForm(){
    
    
    const {token,setFormStep,checkoutData,setCheckoutOrder,setCart,buttonLoader,setButtonLoader} = useAppContext()
    const navigate = useNavigate()
  
    

    function handlePayment(){
        if(token){
        setButtonLoader(true)
        commerce.checkout.capture(token.id, {
            customer: {
              firstname:`${checkoutData.FirstName}`,
              lastname:`${checkoutData.LasttName}`,
                email: `${checkoutData.Email}`
            },
            shipping: {
              name: `${checkoutData.FirstName} ${checkoutData.LastName}`,
              street: `123 fake street`,
              town_city: `someplace`,
              county_state: `${checkoutData.ShippingRegion}`,
              postal_zip_code: ' ',
              country: `${checkoutData.ShippingCountry}`,
            },
            fulfillment: {
              shipping_method: `${checkoutData.ShippingOption[0].id}`,
            },
            payment: {
                gateway: 'test_gateway',
                card: {
                  number: '4242424242424242',
                  expiry_month: '02',
                  expiry_year: '24',
                  cvc: '123',
                  postal_zip_code: '94107',
                },
              },
        
          })
            .then(res => {
                setCheckoutOrder(res)
                setCart([])
                setButtonLoader(false)
               navigate('/confirmation',{replace:true})
            })
            .catch(error => console.error(error))
        }
    }

    return ( 
        <>
         
        <h2 style={{textAlign:'center'}}>Payment</h2>
        {token !== null ?  
        <div className="cardscheckout">
            <div>
                {token.line_items.map((item)=>{
                    return(
                        <div key={item.name} style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',backgroundColor:'darkgrey',padding:'0.3rem 2rem',margin:'1rem 0rem'}}>
                            <div style={{width:'165px'}}>
                             {/* @ts-ignore  */}
                                <img src={item.image?.url}
                                 alt="item image" />
                            </div>
                            <div>
                                <h3 style={{color:'white',margin:'0 1rem'}}>{item.name}</h3>
                                <p style={{fontWeight:'bold',color:'white'}}>Qt: 1</p>
                            </div>
                            <h5 style={{fontSize:'25px',color:'white',}}>{item.price.formatted_with_symbol}</h5>
                        </div>

                    )
                })}
            </div>
        </div>:
        <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
         <h2 style={{fontSize:'40px',margin:'100px 0px'}}>Something went wrong.</h2>
         <h5 style={{marginBottom:'60px',marginTop:'-50px'}}>Return to details page.</h5>
         <button
            style={{
                width:'20%',
                fontSize:"20px",
                backgroundColor:'white',
                color:'black',
                border:'2px solid black',
                }} 
                className=' btn-cart-banner' 
                onClick={()=>setFormStep(prev=>prev - 1)}>Back
            </button> 
         </div> }
        {/* buttons */}
        
        {token &&  
            <div  style={{display:'flex',justifyContent:'center',columnGap:'50px'}}>
                <button
                style={{
                   
                    fontSize:"20px",
                    backgroundColor:'white',
                    color:'black',
                    border:'2px solid black',}} 
                    className='pay btn-cart-banner' 
                    onClick={()=>setFormStep(prev=>prev - 1)}>Back</button> 
                <button
                style={{fontSize:"20px"}} 
                className='pay btn-cart-banner' onClick={handlePayment}>
                    {buttonLoader ? 
                    <Bars
                    height="34"
                    width="249"
                    color="grey"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    // @ts-ignore
        />          : `Pay ${token?.subtotal?.formatted_with_symbol}`}
         
                </button> 
            </div>
         }
       
       

    </>
    )
}