import { CheckBox } from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Paper
} from "@mui/material";
import RadioButtonGroup from "../../shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useFetchFiltersQuery } from "./catalogApi";
import { setOrderBy } from "./catalogSlice";
import Search from "./Search";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price: High to low" },
  { value: "price", label: "Price: Low to hight" },
];

export default function Filters() {
  const { data } = useFetchFiltersQuery();
  const { orderBy } = useAppSelector((state) => state.catalog);
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
        <FormGroup>
          {data &&
            data.brands.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <CheckBox color="secondary" sx={{ py: 0.7, fontSize: 40 }} />
                }
                label={item}
              />
            ))}
        </FormGroup>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <FormGroup>
          {data &&
            data.types.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <CheckBox color="secondary" sx={{ py: 0.7, fontSize: 40 }} />
                }
                label={item}
              />
            ))}
        </FormGroup>
      </Paper>
    </Box>
  );
}
