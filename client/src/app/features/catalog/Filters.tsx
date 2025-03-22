import { Box, Button, Paper } from "@mui/material";
import CheckboxButtons from "../../shared/components/CheckboxButtons";
import RadioButtonGroup from "../../shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import Search from "./Search";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price: High to low" },
  { value: "price", label: "Price: Low to hight" },
];

type Props = {
  filtersData: {
    brands: string[];
    types: string[];
  };
};

export default function Filters({filtersData:data}:Props) {
  const { orderBy, types, brands } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Paper>
        <Search />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          selectedValue={orderBy}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
          options={sortOptions}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>
      <Button onClick={() => dispatch(resetParams())}>Reset Filters</Button>
    </Box>
  );
}
