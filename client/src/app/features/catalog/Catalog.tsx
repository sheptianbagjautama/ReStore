import { useFetchProductsQuery } from "./catalogApi";
import ProductList from "./ProductList";

export default function Catalog() {
  ////Cara menggunakan useEffect
  //  const [products, setProducts] = useState<Product[]>([]);

  //   useEffect(() => {
  //      fetch("https://localhost:5001/api/products")
  //        .then((response) => response.json())
  //        .then((data) => setProducts(data));
  //    }, []);

  ////Cara menggunakan RTK Query
  const {data, isLoading} = useFetchProductsQuery();

  if(isLoading || !data) return <div>Loading...</div>

  return (
    <>
      <ProductList products={data}/>
    </>
  );
}
