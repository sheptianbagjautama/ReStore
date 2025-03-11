import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import Catalog from "../features/catalog/Catalog";
import { Product } from "../models/product";
import NavBar from "./NavBar";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{mt:14}}>
        <Catalog products={products} />
      </Container>
    </>
  );
}

export default App;
