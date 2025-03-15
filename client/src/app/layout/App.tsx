import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";
import NavBar from "./NavBar";



function App() {
  //Cara lama
  // const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode())

  //Cara baru
  const {darkMode} = useAppSelector(state => state.ui);

  const palleteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: palleteType === "light" ? "#121212" : "#eaeaea",
      },
    },
  });

  //Cara lama
  // const toogleDarkMode = () => {
  //   localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  //   setDarkMode(!darkMode);
  // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar/>
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode ? "#121212" : "#eaeaea",
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 14 }}>
          <Outlet/>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
