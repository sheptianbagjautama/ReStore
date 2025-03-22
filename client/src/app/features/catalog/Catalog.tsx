import { Grid2, Typography } from "@mui/material";
import AppPagination from "../../shared/components/AppPagination";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import { setPageNumber } from "./catalogSlice";
import Filters from "./Filters";
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
  const productParams = useAppSelector((state) => state.catalog);
  const { data, isLoading } = useFetchProductsQuery(productParams);
  const { data:filtersData, isLoading:filtersLoading } = useFetchFiltersQuery();

  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        <Filters filtersData={filtersData}  />
      </Grid2>
      <Grid2 size={9}>
        {data.items && data.items.length > 0 ? (
          <>
            <ProductList products={data.items} />
            <AppPagination
              metadata={data.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" }); //Agar ketika klik no halaman , posisi scroll layar selalu diatas
              }}
            />
          </>
        ) : (
          <Typography variant="h5">
            There are no results to this filter
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
