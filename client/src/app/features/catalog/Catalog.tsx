import { Grid2 } from "@mui/material";
import { useFetchProductsQuery } from "./catalogApi";
import ProductList from "./ProductList";
import Filters from "./Filters";

export default function Catalog() {
  ////Cara menggunakan useEffect
  //  const [products, setProducts] = useState<Product[]>([]);

  //   useEffect(() => {
  //      fetch("https://localhost:5001/api/products")
  //        .then((response) => response.json())
  //        .then((data) => setProducts(data));
  //    }, []);

  ////Cara menggunakan RTK Query
  const { data, isLoading } = useFetchProductsQuery();

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        <Filters />
      </Grid2>
      <Grid2 size={9}>
        <ProductList products={data} />
      </Grid2>
    </Grid2>
  );
}
