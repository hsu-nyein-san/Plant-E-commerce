import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../features/public/components/PublicLayout";
import HomePage from "../features/public/pages/HomePage";

import publicRoute from "./publicRoute";
import authRoute from "./authRoute";
import dashboardRoute from "./dashboardRoute";
import NotFound from "../components/NotFound";
import userProfileRoute from "./userProfileRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFound />,
  },
  {
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [...publicRoute],
  },

  ...authRoute,
  ...dashboardRoute,
  ...userProfileRoute
]);

export default router;