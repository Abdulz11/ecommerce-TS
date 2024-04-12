import { GetShippingOptionsResponse } from "@chec/commerce.js/features/checkout"
import { useAppContext } from "../../context/appcontext"
import { commerce } from "../../lib/commerce"
import {useEffect,useState} from 'react'
import { FieldValues, useForm} from 'react-hook-form' 
import { Link } from "react-router-dom"

export default function DetailsForm(){
    const {register, handleSubmit,formState:{errors}} = useForm()
    const {token,setCheckoutData,setFormStep} = useAppContext()
    const [shippingCountries,setShippingCountries] = useState<object>({})
    const [shippingCountryCode,setShippingCountryCode] = useState<string>('')
    const [shippingRegions,setShippingRegions] = useState<object>({})
    const [shippingRegionCode,setShippingRegionCode] = useState<string>('')
    const [shippingOption,setShippingOption] = useState<GetShippingOptionsResponse[]>([])
    
    useEffect(() => {
            async function getShippingCountries() {
                if(token){
                  await commerce.services.localeListCountries().then((response) => {
                    setShippingCountries(response.countries)
                    let country = Object.entries(response.countries)[0]
                    setShippingCountryCode(country[0])
                  
                   
                }
                );
            }
        }
        getShippingCountries()
    }, [token])


    useEffect(() => {
            async function getShippingRegions() {
            if(shippingCountryCode)
               await commerce.services.localeListSubdivisions(shippingCountryCode).then((response) => {
                setShippingRegions(response.subdivisions)
                let subdivision = Object.entries(response.subdivisions)[0]
                setShippingRegionCode(subdivision[0])
               
               });
               
            }
            getShippingRegions()
    
    }, [shippingCountryCode])


    useEffect(() => {
            async function getShippingOptions() {
                if(token && shippingRegionCode)
                commerce.checkout.getShippingOptions(token.id, {
                    country: shippingCountryCode,
                    region: shippingRegionCode,
                   
                  }).then(options =>{
                    setShippingOption(options)
                   
                });
            }
            getShippingOptions()
            
    
    }, [shippingRegionCode])

    function submitUserData(data:FieldValues){
        if(shippingOption.length !== 0){
            let newData = {...data,ShippingOption:shippingOption,ShippingCountry:shippingCountryCode,ShippingRegion:shippingRegionCode}
           
            setCheckoutData(newData)
            setFormStep(prev=>prev + 1)
        }
    }
   
    return (
        <form onSubmit={handleSubmit((data)=>submitUserData(data))}>
        <h2 style={{textAlign:"center"}}>Details</h2>
        <div>
        <p style={{color:'red',textAlign:'center'}}>* fields are required
        </p>
            <div className="checkout-container" style={{ border: '2px solid gray'}}>
                <div className="checkout-fields">
                    <label htmlFor="">First Name<span style={{color:'red'}}>*</span></label>
                    <input type="text" placeholder="FirstName" {...register('FirstName',{required:true})} />
                </div>
                <div className="checkout-fields">
                    <label htmlFor="">Last Name<span style={{color:'red'}}>*</span></label>
                    <input type="text" placeholder="LastName" {...register('LastName',{required:true})} />
                    {/* {errors.root} */}
                </div>
                <div className="checkout-fields">
                    <label htmlFor="">Address</label>
                    <input type="text" placeholder="Address" {...register('Address')} />
                </div>
                <div className="checkout-fields"> 
                    <label htmlFor="">Email<span style={{color:'red'}}>*</span></label>
                    <input type="text" placeholder="Email" {...register('Email',{required:true})} />
                </div>
                <div className="checkout-fields">
                    <label>City</label>
                    <input type="text" placeholder="City" {...register('City')}/>
                </div>
                <div className="checkout-fields">
                    <label >Zip Code</label>
                    <input type="text" placeholder="Zip code" {...register('ZipCode')}/>
                </div>
                <div className="checkout-fields"> 
                    <label htmlFor="">Country</label>
                    <input type="text" placeholder="Country" {...register('Country')} />
                </div>
                <div className="checkout-fields">
                    <label htmlFor="Shipping country">Shipping country<span style={{color:'red'}}>*</span></label>
                    <select  {...register('ShippingCountry',{onChange:(e)=>{
                        setShippingCountryCode(e.target.value)
                    }})}>
                        { Object.keys(shippingCountries) &&
                        Object.entries(shippingCountries).map((country)=><option key={country[0]} value={country[0]}>{country[1]}</option>) 
                        }
                    </select>
                </div>
                <div className="checkout-fields">
                    <label>Shipping Regions<span style={{color:'red'}}>*</span></label>
                    <select {...register('ShippingRegion',{onChange:(e)=>
                        setShippingRegionCode(e.target.value)
                    })}>
                        {Object.keys(shippingRegions) && Object.entries(shippingRegions).map((region)=><option key={region[0]} value={[region[0]]}>{region[1]}</option>)
                        }
                    
                    </select>
                </div>
                <div className="checkout-fields">
                    <label htmlFor="">Shipping Options<span style={{color:'red'}}>*</span></label>
                    <select {...register('ShippingOption')}>
                        { shippingOption.length !== 0 ? 
                        <option>{shippingOption[0].description}-({shippingOption[0].price.formatted_with_symbol})</option> : <option>No options available</option>}
                    </select>
                </div> 
            </div>    
            <div style={{display:'flex',justifyContent:'center',columnGap:'10rem',padding:'1rem'}}>
                    <div className="radio">
                        <label htmlFor="" style={{color:'gray',marginRight:'20px'}}>Pay with card</label>
                        <input type="radio" disabled name="payWithCard"  />
                    </div>
                    <div className="radio">
                        <label htmlFor="payWithoutCard" style={{marginRight:'20px'}}>Pay without card</label>
                        <input type="radio" defaultChecked {...register('payWithCard')}/>
                    </div>
                </div>  
      </div>
      <div  style={{display:'flex',justifyContent:'center',columnGap:'50px',margin:'3rem',}}>
            <Link 
            style={{
                // width:'20%',
                backgroundColor:'white',
                color:'black',
                border:'2px solid black',}} 
            className='btn-cart-banner' to="/cart" >Back to Cart</Link> 
            <button type="submit"
            // style={{width:'20%',}} 
            className='btn-cart-banner'>Proceed to Payment</button> 
        </div>
   </form>
      
    )
   
}