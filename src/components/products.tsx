import {Container} from 'react-bootstrap'
import { useEffect,useMemo,useState} from 'react';
import { useAppContext} from '../context/appcontext';
import {commerce} from '../lib/commerce'
import { Product } from '@chec/commerce.js/types/product';
import { useNavigate } from 'react-router-dom';



function Products(){
  const [products,setProducts] = useState<Product[]>([])
  const navigate = useNavigate()
  const {addToCart,checkIfAddedToCart} = useAppContext()
 
  
 
  useEffect(() => {
   commerce.products.list().then(response => {
    selectProduct(response.data)})
  }
  ,[])

  function makeRandomNumberArray():number[]{
    let numArr:number[] = [] 
    for(let i=0;i < 8;i++){
      let randomNumber = Math.floor(Math.random() * 9)
      if(numArr.includes(randomNumber)){
        i--
        continue
      }
      numArr[i] = randomNumber

    }
    return numArr
  }

  let randomNumArray = useMemo(() =>makeRandomNumberArray(), [])
  

  

 function selectProduct(productArray:Product[]){
  let newArray:Product[]=[]
  randomNumArray.map(number=>{
    productArray.map((objItems,index)=>{
    if(number === index){
        newArray.push(objItems)
    }
   })
 })
 setProducts(newArray)
 
}


function goToCategory(route:string){
  navigate(`${route}`)
}

  return (
      <Container  style={{marginTop:"150px"}} id='products'>
        <h2 style={{marginBottom:'-60px'}}>Products</h2>
          <div  className='overall-product-div' style={{borderTop:"2px solid grey",borderBottom: products.length > 0 ? "2px solid grey" : ''}}>
          {products.length > 0 && products.map(item=>
            <div key={item.id} className='products-div'>
              <div className='product-img-div'>
                <img src={item.image?.url} alt="image of products" />
              </div>
              <div className='img-overlay'>
                <button onClick={()=>goToCategory(item.categories[0].slug)}><i className="bi-list-nested fa-6x" style={{fontSize:"30px",fontWeight:'bold'}}></i></button>
               <div>....</div>
                <button onClick={()=>{
                    addToCart(item.id,{
                    id:item.id,
                    name:item.name,
                    image:item.image?.url,
                    price:item.price.raw
                  })
                }}><i className={checkIfAddedToCart(item.id) ? 'bi-cart-x':'bi-cart'} style={{fontSize:"30px"}}></i></button>
              </div>
            </div> )
          } 
        </div> 
      </Container>
   

  )
}


export default Products