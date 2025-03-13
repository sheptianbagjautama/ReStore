import { useDispatch, useSelector } from "react-redux"
import { CounterState } from "./counterReducer"
import { Button, ButtonGroup, Typography } from "@mui/material";

export default function ContactPage() {
  //Untuk mendapatkan state dan state mana yang akan kita gunakan
  const data = useSelector((state:CounterState) => state.data);

  //Untuk dispatch menugaskan perubahan state sesuai dengan action yang di kirim
  const dispatch = useDispatch();


  return (
    <>
    <Typography variant="h2">
      Contact Page
    </Typography>
    <Typography variant="body1">
      The data is : {data}
    </Typography>
    <ButtonGroup>
      <Button onClick={() => dispatch({type:'decrement'})} color="error">Decrement</Button>
      <Button onClick={() => dispatch({type:'increment'})} color="secondary">Increment</Button>
    </ButtonGroup>
    </>
  )
}