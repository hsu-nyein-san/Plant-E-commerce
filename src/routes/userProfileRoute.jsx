import { lazy } from "react";
import PersonalInformationPage from "../features/user-profile/pages/PersonalInformationPage";
import EditProfilePage from "../features/user-profile/pages/EditProfilePage";
const UserProfilePage = lazy(() =>
  import("../features/user-profile/pages/UserProfilePage")
);
const PasswordChangePage = lazy(() =>
  import("../features/user-profile/pages/PasswordChangePage")
);

const userProfileRoute = [
  {
    path: "user-profile",
    element: <UserProfilePage />,
  },
  {
    path: "user-profile/personal-information",
    element: <PersonalInformationPage />,
  },
  {
    path: "user-profile/change-password",
    element: <PasswordChangePage />,
  },
  {
    path: "user-profile/edit-profile",
    element: <EditProfilePage />,
  },
 
  
];

export default userProfileRoute;
