import {Container} from 'react-bootstrap'
import { useEffect,useMemo} from 'react';
import {commerce} from '../lib/commerce'
import TESTImg from '../assets/images/pexels-ksenia-chernaya-3965548.jpg'
import { Product } from '@chec/commerce.js/types/product';


function Products(){
  // const [product,setProducts] = useState<Product[]>([])
 

 
  useEffect(() => {
   commerce.products.list().then(response => selectProduct(response.data))
  }
  ,[])

  function makeRandomNumberArray():number[]{
    let numArr:number[] = [] 
    let oldRando:number;
    for(let i=0;i < 8;i++){
      let randomNumber = Math.floor(Math.random() * 9)
      if(numArr.includes(randomNumber)){
        i--
        continue
      }
      oldRando = randomNumber
      numArr[i] = randomNumber

    }
 return numArr
  }

  let randomNumArray = useMemo(() =>makeRandomNumberArray(), [])
  

 function selectProduct(productArray:Product[]){

  let newArray:Product[] = []  
  randomNumArray.map(number=>{
    productArray.map((objItems,index)=>{
    if(number === index){
        newArray.push(objItems)
    }
   })
 }
 )
 return newArray
}

  return (
    <Container >
      <div className='products-div'>
        <div className='product-img-div'>
          <img src={TESTImg} alt="" />
        </div>
        <div className='img-overlay'>
          <button>buy now</button>
        </div>
      </div>  
    </Container>

  )
}

export default Products