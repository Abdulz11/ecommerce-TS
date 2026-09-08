import Categories from "../components/categories";
import Slider from "../components/slider";
import Products from "../components/products";
import Newsletter from "../components/newsletter";

function Home() {
  return (
    <>
      <Slider />
      <Categories />
      <Products />
      <Newsletter />
    </>
  );
}

export default Home;
