import { Container, Row, Col,Card } from "react-bootstrap"
import { Link } from "react-router-dom"
// import { useAppContext } from "../context/appcontext"

function Categories() {
//  const {checkIt} = useAppContext()
//  console.log(checkIt)
  return (
    <Container  >
      <h2>Categories</h2>
        <Row className='gy-5'>
            <Col>
           <Card className='card-div'>
            <Card.Img src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1vZGVsJTIwaW4lMjBjbG90aGVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'/>
               <Card.ImgOverlay className='cards-overlay text-center'>
                <Card.Text style={{fontSize:'30px',fontWeight:"700",color:'white'}} className='overlay-text'>CLOTHES</Card.Text>
                <Link to='./clothes'>
                  <button style={{fontSize:'16px',fontWeight:'700'}}>Shop Now</button>
                </Link>
               </Card.ImgOverlay>
           </Card>
            </Col>
            <Col>
            <Card  className='card-div'>
            <Card.Img src='https://media.istockphoto.com/id/934679404/photo/open-laptop-with-white-digital-tablet-and-smartphone-on-desk-from-above.webp?b=1&s=170667a&w=0&k=20&c=DSddeaw7hmv1RodQXcKcTC6t97w4NlfV5XgrNcrilT8='/>
               <Card.ImgOverlay className='cards-overlay text-center'>
               <Card.Text style={{fontSize:'30px',fontWeight:"700",color:'white'}} className='overlay-text'>DEVICES</Card.Text>
               <Link to='./devices'>
                  <button style={{fontSize:'16px',fontWeight:'700'}}>Shop Now</button>
                </Link>
               </Card.ImgOverlay>
           </Card>
            </Col>
            <Col>
            <Card className='card-div'>
            <Card.Img src='https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S0lUQ0hFTiUyMFdBUkVTfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'/>
               <Card.ImgOverlay className='cards-overlay text-center'>
               <Card.Text style={{fontSize:'30px',fontWeight:"700",color:'white'}} className='overlay-text'>KITCHEN WARES</Card.Text>
               <Link to='./kitchenwares'>
                <button style={{fontSize:'16px',fontWeight:'700'}}>Shop Now</button>
               </Link>
               </Card.ImgOverlay>
           </Card>
            </Col>
        </Row>
    </Container>
  )
}

export default Categories