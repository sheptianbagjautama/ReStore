import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { decrement, increment } from "./counterReducer";

export default function ContactPage() {
  //Untuk mendapatkan state dan state mana yang akan kita gunakan
  const {data} = useAppSelector(state => state.counter);

  //Untuk dispatch menugaskan perubahan state sesuai dengan action yang di kirim
  const dispatch = useAppDispatch();


  return (
    <>
    <Typography variant="h2">
      Contact Page
    </Typography>
    <Typography variant="body1">
      The data is : {data}
    </Typography>
    <ButtonGroup>
      <Button onClick={() => dispatch(decrement(1))} color="error">Decrement</Button>
      <Button onClick={() => dispatch(increment(1))} color="secondary">Increment</Button>
      <Button onClick={() => dispatch(increment(5))} color="primary"> by 5</Button>
    </ButtonGroup>
    </>
  )
}