import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { DownloadForOfflineOutlined } from "@mui/icons-material";


const Menuitems = [
  {
    title: "All Task",
    icon: DashboardOutlinedIcon,
    href: "/tasks",
  },
  {
    title: "Add Task",
    icon: AddToPhotosOutlinedIcon,
    href: "/add-task",
  },
  {
    title: "Import",
    icon: AssignmentTurnedInOutlinedIcon,
    href: "/import-data",
  }
];

export default Menuitems;
