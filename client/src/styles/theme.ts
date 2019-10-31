import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  primary: {
    light: '#33919f',
    main: '#007687',
    dark: '#00525e',
    contrastText: '#fff',
  },
  secondary: {
    light: '#9b549d',
    main: '#822a85',
    dark: '#5b1d5d',
    contrastText: '#fff',
  },
  success: {
    main: '#3ABF94'
  },
  warning: {
    main: '#f9a825'
  },
  error: {
    main: '#F55D5D'
  },
  services: {
    SEO: '#ff9800',
    PAID_SEARCH: '#f44336',
    PAID_SOCIAL: '#3f51b5',
    CONTENT: '#4caf50'
  }
};

const theme = createMuiTheme({
  palette,
  overrides: {
    MuiPaper: {
      elevation0: {
        borderRadius: 2
      }
    },
    MuiInputBase: {
      root: {
        height: 42
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '12px 14px'
      }
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(14px, 14px) scale(1)'
      }
    },
    MuiTable: {
      root: {
        maxWidth: '100%',
        overflowX: 'auto'
      }
    },
    MuiTableRow: {
      root: {
        '& td:nth-child(2)': {
          position: 'sticky',
          left: 0,
          zIndex: 299,
          background: '#fff',
        },
        '& th:first-child': {
          position: 'sticky',
          left: 0,
          top: 0,
          zIndex: 300,
        },
        '&:hover': {
          '& td:nth-child(2)': {
            background: '#ededed'
          }
        }
      }
    },
    // @ts-ignore
    MUIDataTableHeadCell: {
      sortLabelRoot: {
        height: 20,
        '& svg': {
          fontSize: 16
        }
      }
    },
    // @ts-ignore
    MUIDataTableToolbar: {
      root: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      },
      titleText: {
        fontSize: 16,
        fontWeight: 300
      }
    },
    MuiTablePagination: {
      root: {
        borderBottom: 'none !important'
      }
    }
  }
});

export default theme;