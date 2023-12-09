
import {createContext,useContext,useState} from 'react'
import {commerce} from '../lib/commerce'
import {ReactNode} from 'react'
import { FieldValues } from 'react-hook-form'
import { CheckoutToken } from '@chec/commerce.js/types/checkout-token'
import { CheckoutCaptureResponse } from '@chec/commerce.js/types/checkout-capture-response'


 export const AppContext = createContext<ObjContext>({} as ObjContext)
 export function useAppContext(){ return useContext(AppContext)}




 export interface ObjContext{
  checkoutOrder:CheckoutCaptureResponse | null,
  buttonLoader:boolean,
  setButtonLoader:React.Dispatch<React.SetStateAction<boolean>>,
  setCheckoutOrder:React.Dispatch<React.SetStateAction<CheckoutCaptureResponse | null>>,
  formStep:number,
  token: CheckoutToken | null
  setToken:React.Dispatch<React.SetStateAction<CheckoutToken | null>>
  setFormStep:React.Dispatch<React.SetStateAction<number>>,
  addToCart:(id:string,listItem:{id:string;name:string;image?:string;price:number })=>void,
  checkIfAddedToCart:(id:string)=>boolean,
  removeItem:(id:string)=>void,
  setPath:React.Dispatch<React.SetStateAction<string>>,
  path:string,
  clearCart:()=>void,
  tokenID:string,
  checkoutData:FieldValues,
  setCheckoutData: React.Dispatch<React.SetStateAction<FieldValues>>
  setTokenID:React.Dispatch<React.SetStateAction<string>>,
  cart:({id:string;name:string;image?:string,price:number})[],
  setCart:React.Dispatch<React.SetStateAction<{
    id: string;
    name: string;
    image?:string;
    price:number
}[]>>
}




 

export function AppContextProvider({children}:{children:ReactNode}) {

  const [formStep,setFormStep] = useState(1)
  const [buttonLoader,setButtonLoader] = useState(false)
  const [checkoutOrder,setCheckoutOrder] = useState<CheckoutCaptureResponse | null>(null)
  const [token,setToken] = useState<CheckoutToken | null>(null)
  const [path,setPath] = useState<string>(" ")
  const [tokenID,setTokenID] = useState<string>('') 
  const [cart,setCart] = useState<({id:string ,name:string,image?:string,price:number})[]>(JSON.parse(localStorage.getItem('cart')!) || [])
  const [checkoutData,setCheckoutData] = useState<FieldValues>({})
 


 function removeItem(id:string):void{
  commerce.cart.remove(id).then();
 let filteredCart = cart.filter(item=>item.id!==id)
 setCart(filteredCart)
 localStorage.setItem('cart',JSON.stringify(cart))
 }

 function clearCart(){
  setCart([])
  commerce.cart.empty().then();
  localStorage.removeItem('cart')
}


  function addToCart(id:string,listItem:{id:string;name:string;image?:string,price:number}):void {
    if(!checkIfAddedToCart(id)){
      commerce.cart.add(id,1);
      let newItem = {id: listItem.id,name:listItem.name,image:listItem.image,price:listItem.price}
      setCart((prev)=>{
        localStorage.setItem('cart',JSON.stringify([...prev,newItem]))
        return [...prev , newItem]
      })
    }
   }

   function checkIfAddedToCart(id:string){ 
    let val = false
    cart.forEach((item)=>{
      if(id == item.id){
       val = true
      }
    })
    return val  
   }
  
  
  return (
    <AppContext.Provider value={{addToCart,checkIfAddedToCart,cart,checkoutData,setCheckoutData,clearCart,setCart,removeItem,path,setPath,tokenID,setTokenID,formStep,setFormStep,token,setToken,checkoutOrder,setCheckoutOrder,buttonLoader,setButtonLoader}}>
        {children}
    </AppContext.Provider>
  )
}

