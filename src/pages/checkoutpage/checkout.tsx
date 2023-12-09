import { useAppContext } from '../../context/appcontext'
import DetailsForm from './details'
import PaymentForm from './payment'






export default function Checkout() {
  const {formStep} = useAppContext()
//  console.log(formStep)
//  const history = useHistory()
//  function backToHome(){

//  }
    
 
  return (
    <>
        <div style={{textAlign:'center',marginBottom:'5rem'}}>
        <h1>Shop & Drop</h1>
        </div>
        { formStep == 1 && <DetailsForm /> }
        { formStep == 2 && <PaymentForm/> }
        { formStep == 3 && <ConfirmationPage/> }
    </>
  )
}

function ConfirmationPage(){
  return (
    <>
  <h1>Payment Succesful</h1>
  <a
  style={{
      width:'20%',
      fontSize:"20px",
      backgroundColor:'white',
      color:'black',
      border:'2px solid black',}} 
      className='btn-cart-banner' 
     >Back</a> 
  </>
  )
}


