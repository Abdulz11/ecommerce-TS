
import {createContext,useContext,useState} from 'react'
import {commerce} from '../lib/commerce'
import {ReactNode} from 'react'

 export const AppContext = createContext<ObjContext>({} as ObjContext
 )

//  FOR GETTING ALL PRODUCTS OR SPECIFY CATEGORY
// 1.commerce.products.list().then(response => response.data);
//  2.commerce.products.list({
//   category_slug: ['shoes'],
// }).then(response => response.data);

 export interface ObjContext{
  addToCart:(id:string,listItem:{id:string;name:string;image?:string})=>void,
  checkIfAddedToCart:(id:string)=>boolean,
  removeItem:(id:string)=>void,
  setPath:React.Dispatch<React.SetStateAction<string>>,
  path:string,
  cart:({id:string;name:string;image?:string})[],
  setCart:React.Dispatch<React.SetStateAction<{
    id: string;
    name: string;
    image?:string;
}[]>>
}
  

// commerce.cart.contents().then((items) => console.log(items));
// commerce.cart.remove('item_7RyWOwmK5nEa2V').then((response) => console.log(response));
 export function useAppContext():ObjContext{
    return useContext(AppContext)
 }

export function AppContextProvider({children}:{children:ReactNode}) {
  const [path,setPath] = useState<string>(" ")
 
  const [cart,setCart] = useState<({id:string ,name:string,image?:string})[]>([{ id: '23445',
    name: 'my item',
   }])
 


 function removeItem(id:string):void{
  commerce.cart.remove(id).then((response) => console.log(response));
 let filteredCart = cart.filter(item=>item.id!==id)
 setCart(filteredCart)
 }

  function addToCart(id:string,listItem:{id:string;name:string;image?:string}):void {
    if(!checkIfAddedToCart(id)){
      console.log('ive not been added')
      commerce.cart.add(id,1);
      setCart((prev)=>{
        let newItem = {id: listItem.id,name:listItem.name,image:listItem.image}
        return [...prev , newItem]
        
      })
      
      // checkIfAddedToCart(id)
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
    <AppContext.Provider value={{addToCart,checkIfAddedToCart,cart,setCart,removeItem,setPath,path}}>
        {children}
    </AppContext.Provider>
  )
}

