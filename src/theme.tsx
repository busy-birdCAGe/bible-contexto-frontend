import { createTheme } from "@mui/material";

// const theme = createTheme({
//     palette: {
//         mode: 'light'
//     }
// })

const theme = createTheme({
  typography: {
    fontFamily: [
        'monospace',

    //   'Roboto',
    //   'Helvetica',
    //   'Arial',
      'sans-serif',
    ].join(','),
  },
  
});


export default theme;