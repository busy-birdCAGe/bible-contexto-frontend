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
          // position: 'fixed',
          // overscrollBehaviorY: 'none',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
  palette: {
    background: {
      default: '#000000', // Replace with your desired background color
    },
  },
  
});


export default theme;