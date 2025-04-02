import { createTheme } from "@mui/material/styles";
import o from "./Typography";
import e from "./Shadows";

let SidebarWidth = 265,
  TopbarHeight = 70;

// Function to create theme with light mode only
const getTheme = () =>
  createTheme({
    direction: "ltr",

    palette: {
      mode: "light",
      primary: {
        main: "#ffffff",
      },
      secondary: {
        main: "#000000",
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
      text: {
        primary: "#000000",
        secondary: "#666666",
      },
      divider: "#e2e8f0",
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
            scrollBehavior: "smooth",
          },
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-track": {
            background: "#f1f5f9",
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "4px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            background: "#94a3b8",
          },
          html: { height: "100%", width: "100%" },
          body: {
            height: "100%",
            margin: 0,
            padding: 0,
            backgroundColor: "#f8fafc",
            transition: "background-color 0.3s ease",
          },
          "#root": { height: "100%" },
        },
      },

      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: "24px !important",
            paddingRight: "24px !important",
            maxWidth: "1600px",
            "@media (max-width: 600px)": {
              paddingLeft: "16px !important",
              paddingRight: "16px !important",
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "12px",
            fontWeight: 500,
            boxShadow: "none",
            padding: "8px 20px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f8fafc",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              backgroundColor: "#f1f5f9",
              color: "#94a3b8",
            },
          },
          sizeLarge: {
            padding: "12px 24px",
            fontSize: "1.1rem",
          },
          sizeSmall: {
            padding: "6px 16px",
            fontSize: "0.875rem",
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "8px",
            transition: "all 0.2s ease-in-out",
            color: "#769aff", // Smooth pastel blue text for light mode
            "&:hover": {
              color: "#6EC1FF", // Slightly darker smooth blue for hover in light mode
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(0.95)",
              color: "#4682B4", // A more noticeable blue for active state in light mode
            },
            "&:focus": {
              color: "#A3C8FF", // Smooth pastel blue on focus in light mode
            },
            "&.Mui-disabled": {
              color: "#B0D4FF", // Muted pastel blue for light mode disabled
              pointerEvents: "none", // Disable pointer events when the button is disabled
            },
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            marginBottom: "4px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#f8fafc",
              transform: "translateX(4px)",
            },
            "&.Mui-selected": {
              backgroundColor: "#e2e8f0", // Active background color
              color: "#000000", // Text color
              transform: "translateX(2px)", // Slightly less translation when active
            },
          },
        },
      },

      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: "20px",
            padding: "24px",
            margin: "16px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
            },
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              transition: "all 0.2s ease-in-out",
              "& fieldset": {
                borderColor: "#e2e8f0",
                transition: "border-color 0.2s ease",
              },
              "&:hover fieldset": {
                borderColor: "#000000",
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
              },
              "& input": {
                padding: "14px 16px",
              },
              "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(0,0,0,0.05)",
              },
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: "12px", // Set rounded corners for the select input
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e2e8f0", // Outline color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000000", // Outline color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px", // Increase border width when focused
            },
          },
          select: {
            color: "#000000", // Text color
            "&.Mui-focused": {
              color: "#000000", // Text color on focus
            },
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: "8px",
            borderRadius: "8px",
            transition: "transform 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
            "&.Mui-checked": {
              color: "#1976d2", // Primary blue for light mode
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            padding: "8px",
            transition: "transform 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
            "&.Mui-checked": {
              color: "#f57c00", // Orange tone
            },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            padding: "8px",
            "& .MuiSwitch-thumb": {
              width: "20px",
              height: "20px",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              backgroundColor: "#fff",
            },
            "& .Mui-checked .MuiSwitch-thumb": {
              backgroundColor: "#f57c00",
            },
            "& .MuiSwitch-track": {
              borderRadius: "12px",
              backgroundColor: "#1976d2",
              opacity: 1,
            },
            "& .Mui-checked .MuiSwitch-track": {
              borderRadius: "12px",
              backgroundColor: "#000",
              opacity: 1,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#efefef !important",
              opacity: 1,
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            boxShadow: "none",
            borderBottom: "1px solid #e2e8f0",
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#f8fafc",
            color: "#000",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "0.875rem",
          },
          arrow: {
            color: "#f8fafc",
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid #e2e8f0",
            padding: "16px",
          },
          head: {
            fontWeight: 600,
            backgroundColor: "#f8fafc",
          },
        },
      },

      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": {
              borderRadius: "8px",
              margin: "0 4px",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                backgroundColor: "#f8fafc",
              },
              "&.Mui-selected": {
                backgroundColor: "#000000",
                color: "#ffffff",
              },
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "12px 16px",
          },
          standardSuccess: {
            backgroundColor: "#ffffff",
            color: "#065f46",
            "& .MuiAlert-icon": {
              color: "#065f46",
            },
          },
          standardError: {
            backgroundColor: "#ffffff",
            color: "#991b1b",
            "& .MuiAlert-icon": {
              color: "#991b1b",
            },
          },
          standardWarning: {
            backgroundColor: "#ffffff",
            color: "#92400e",
            "& .MuiAlert-icon": {
              color: "#92400e",
            },
          },
          standardInfo: {
            backgroundColor: "#ffffff",
            color: "#1e40af",
            "& .MuiAlert-icon": {
              color: "#1e40af",
            },
          },
        },
      },

      MuiBadge: {
        styleOverrides: {
          badge: {
            borderRadius: "6px",
            padding: "0 6px",
            minWidth: "20px",
            height: "20px",
          },
        },
      },
    },

    mixins: {
      toolbar: {
        color: "#000000",
        "@media(min-width:1280px)": {
          minHeight: TopbarHeight,
          padding: "0 30px",
        },
        "@media(max-width:1280px)": {
          minHeight: "64px",
        },
      },
    },
    typography: o,
    shadows: e,
    transitions: {
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
      },
    },
  });

export { TopbarHeight, SidebarWidth, getTheme };