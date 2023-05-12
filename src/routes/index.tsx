import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login, system } from "../api";

import InitPage from "../pages/init";
import { getToken } from "../utils";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import DashboardPage from "../pages/dashboard";
import ChangePasswordPage from "../pages/administrator/change-password";
import SystemApplicationPage from "../pages/system/application";
import SystemLogPage from "../pages/system/systemLog/index";

import ErrorPage from "../pages/error";

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.getSystemConfig();
        let userRes: any = await login.getUser();
        let addonsRes: any = await system.addonsList();

        resolve({
          default: (
            <InitPage
              configData={configRes.data}
              loginData={userRes.data}
              addonsData={addonsRes.data}
            />
          ),
        });
      } catch (e) {
        console.error("系统初始化失败", e);
        resolve({
          default: <ErrorPage />,
        });
      }
    });
  });
} else {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
  RootPage = <InitPage />;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: RootPage,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/administrator/change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "/system/application",
            element: <SystemApplicationPage />,
          },
          {
            path: "/systemLog/index",
            element: <SystemLogPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
];

export default routes;
