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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overscrollBehaviorY: 'none',
          height: '100%',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
  
  
});


export default theme;