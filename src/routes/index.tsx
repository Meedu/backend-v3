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
import SystemAdministratorPage from "../pages/system/administrator/index";
import SystemAdministratorCreatePage from "../pages/system/administrator/create";
import SystemAdministratorUpdatePage from "../pages/system/administrator/update";
import SystemAdminrolesPage from "../pages/system/adminroles/index";
import SystemAdminrolesCreatePage from "../pages/system/adminroles/create";
import SystemAdminrolesUpdatePage from "../pages/system/adminroles/update";
import StatsTransactionPage from "../pages/stats/transaction";
import StatsContentPage from "../pages/stats/content";
import StatsMemberPage from "../pages/stats/member";
import RolePage from "../pages/role/index";
import RoleCreatePage from "../pages/role/create";
import RoleUpdatePage from "../pages/role/update";
import WechatPage from "../pages/wechat/index";
import WechatCreatePage from "../pages/wechat/create";
import WechatUpdatePage from "../pages/wechat/update";
import PromoCodePage from "../pages/promocode/index";

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
          { path: "/role", element: <RolePage /> },
          { path: "/addrole", element: <RoleCreatePage /> },
          { path: "/editrole", element: <RoleUpdatePage /> },
          { path: "/promocode", element: <PromoCodePage /> },
          {
            path: "/wechat/messagereply/index",
            element: <WechatPage />,
          },
          {
            path: "/wechat/messagereply/create",
            element: <WechatCreatePage />,
          },
          {
            path: "/wechat/messagereply/update",
            element: <WechatUpdatePage />,
          },
          {
            path: "/system/administrator",
            element: <SystemAdministratorPage />,
          },
          {
            path: "/system/administrator/create",
            element: <SystemAdministratorCreatePage />,
          },
          {
            path: "/system/administrator/update",
            element: <SystemAdministratorUpdatePage />,
          },
          {
            path: "/system/adminroles",
            element: <SystemAdminrolesPage />,
          },
          {
            path: "/system/adminroles/create",
            element: <SystemAdminrolesCreatePage />,
          },
          {
            path: "/system/adminroles/update",
            element: <SystemAdminrolesUpdatePage />,
          },
          {
            path: "/system/application",
            element: <SystemApplicationPage />,
          },
          {
            path: "/systemLog/index",
            element: <SystemLogPage />,
          },
          {
            path: "/stats/transaction/index",
            element: <StatsTransactionPage />,
          },
          { path: "/stats/content/index", element: <StatsContentPage /> },
          { path: "/stats/member/index", element: <StatsMemberPage /> },
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
