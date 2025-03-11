import { Button } from "@mui/material";
import { Product } from "../../models/product";

type Props = {
  products:Product[];
  addProduct:() => void;
}

export default function Catalog({products, addProduct}:Props) {
  return (
    <>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
      <Button variant="contained" onClick={addProduct}>Add Product</Button>
    </>
  );
}
