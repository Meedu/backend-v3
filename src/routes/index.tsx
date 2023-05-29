import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login, system } from "../api";

import InitPage from "../pages/init";
import { getToken } from "../utils";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import DashboardPage from "../pages/dashboard";
import ChangePasswordPage from "../pages/administrator/change-password";
import CoursePage from "../pages/course/index";
import CourseCategoryPage from "../pages/course/category/index";
import CourseCommentsPage from "../pages/course/comments";
import CourseVideoCommentsPage from "../pages/course/video/comments";
import CourseVideoImportPage from "../pages/course/video/import";
import CourseUsersPage from "../pages/course/users";
import CourseAttachPage from "../pages/course/attach/index";
import CourseAttachCreatePage from "../pages/course/attach/create";
import CourseVideoPage from "../pages/course/video/index";
import CourseVideoRecordsPage from "../pages/course/video/watch-records";
import CourseVideoSubscribePage from "../pages/course/video/subscribe";
import CourseChapterPage from "../pages/course/chapter/index";
import CourseAliyunPage from "../pages/course/video/aliyun-hls";
import CourseTencentPage from "../pages/course/video/tencent-hls";
import LearnPathPage from "../pages/learningpath/index";
import LearnPathCreatePage from "../pages/learningpath/create";
import LearnPathUpdatePage from "../pages/learningpath/update";
import LearnPathUserPage from "../pages/learningpath/user";
import LearnPathCategoryPage from "../pages/learningpath/category/index";
import LearnPathStepPage from "../pages/learningpath/step/index";
import LearnPathStepCreatePage from "../pages/learningpath/step/create";
import LearnPathStepUpdatePage from "../pages/learningpath/step/update";
import MemberPage from "../pages/member/index";
import MemberImportPage from "../pages/member/import";
import MemberDetailPage from "../pages/member/detail";
import MemberProfilelPage from "../pages/member/profile";
import MemberTagsPage from "../pages/member/tags/index";
import MemberTagsCreatePage from "../pages/member/tags/create";
import MemberTagsUpdatePage from "../pages/member/tags/update";
import SnapshotPage from "../pages/snapshot/index";
import SnapshotImagesPage from "../pages/snapshot/images";
import CertificatePage from "../pages/certificate/index";
import CertificateUsersPage from "../pages/certificate/users";
import OrderPage from "../pages/order/index";
import OrderRefundPage from "../pages/order/refund";
import OrderDetailPage from "../pages/order/detail";
import OrderRechargePage from "../pages/order/recharge";
import WithdrawOrdersPage from "../pages/order/withdrawOrders";
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
import PromoCodeImportPage from "../pages/promocode/import";
import PromoCodeCreateMultiPage from "../pages/promocode/create-multi";
import PromoCodeCreatePage from "../pages/promocode/create";
import WendaPage from "../pages/wenda/index";
import WendaCategoriesPage from "../pages/wenda/category/index";
import WendaCategoriesCreatePage from "../pages/wenda/category/create";
import WendaCategoriesUpdatePage from "../pages/wenda/category/update";
import WendaAnswerPage from "../pages/wenda/answer";
import WendaCommentPage from "../pages/wenda/comment";
import MultiSharePage from "../pages/multi_level_share/index";
import MultiShareRewardsPage from "../pages/multi_level_share/rewards";
import MultiShareCreatePage from "../pages/multi_level_share/create";
import MultiShareUpdatePage from "../pages/multi_level_share/update";
import CodeExchangerPage from "../pages/codeExchanger/index";
import CodeExchangerCreatePage from "../pages/codeExchanger/create";
import CodeExchangerUpdatePage from "../pages/codeExchanger/update";
import CodeExchangerCodesPage from "../pages/codeExchanger/codes";
import MiaoshaPage from "../pages/miaosha/index";
import MiaoshaCreatePage from "../pages/miaosha/create";
import MiaoshaUpdatePage from "../pages/miaosha/update";
import MiaoshaOrdersPage from "../pages/miaosha/orders";
import CreditMallPage from "../pages/creditMall/index";
import CreditMallCreatePage from "../pages/creditMall/create";
import CreditMallUpdatePage from "../pages/creditMall/update";
import CreditMallOrdersPage from "../pages/creditMall/orders/index";
import CreditMallOrdersUpdatePage from "../pages/creditMall/orders/update";
import CreditMallOrdersSendPage from "../pages/creditMall/orders/send";
import SystemConfigPage from "../pages/system/config/index";

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
          { path: "/course/vod/index", element: <CoursePage /> },
          {
            path: "/course/vod/category/index",
            element: <CourseCategoryPage />,
          },
          {
            path: "/course/vod/components/vod-comments",
            element: <CourseCommentsPage />,
          },
          {
            path: "/course/vod/video/comments",
            element: <CourseVideoCommentsPage />,
          },
          { path: "/course/vod/:courseId/view", element: <CourseUsersPage /> },
          {
            path: "/course/vod/video-import",
            element: <CourseVideoImportPage />,
          },
          { path: "/course/vod/attach/index", element: <CourseAttachPage /> },
          {
            path: "/course/vod/attach/create",
            element: <CourseAttachCreatePage />,
          },
          { path: "/course/vod/video/index", element: <CourseVideoPage /> },
          {
            path: "/course/vod/video/watch-records",
            element: <CourseVideoRecordsPage />,
          },
          {
            path: "/course/vod/video/subscribe",
            element: <CourseVideoSubscribePage />,
          },
          {
            path: "/course/vod/chapter/index",
            element: <CourseChapterPage />,
          },
          {
            path: "/course/vod/video/hls/aliyun",
            element: <CourseAliyunPage />,
          },
          {
            path: "/course/vod/video/hls/tencent",
            element: <CourseTencentPage />,
          },
          { path: "/learningpath/path/index", element: <LearnPathPage /> },
          {
            path: "/learningpath/path/create",
            element: <LearnPathCreatePage />,
          },
          {
            path: "/learningpath/path/update",
            element: <LearnPathUpdatePage />,
          },
          { path: "/learningpath/path/user", element: <LearnPathUserPage /> },
          {
            path: "/learningpath/path/category/index",
            element: <LearnPathCategoryPage />,
          },
          {
            path: "/learningpath/step/index",
            element: <LearnPathStepPage />,
          },
          {
            path: "/learningpath/step/create",
            element: <LearnPathStepCreatePage />,
          },
          {
            path: "/learningpath/step/update",
            element: <LearnPathStepUpdatePage />,
          },
          { path: "/member/index", element: <MemberPage /> },
          { path: "/member/import", element: <MemberImportPage /> },
          { path: "/member/:memberId", element: <MemberDetailPage /> },
          {
            path: "/member/profile/:memberId",
            element: <MemberProfilelPage />,
          },
          { path: "/member/tag/index", element: <MemberTagsPage /> },
          { path: "/member/tag/create", element: <MemberTagsCreatePage /> },
          { path: "/member/tag/update", element: <MemberTagsUpdatePage /> },
          { path: "/snapshot/index", element: <SnapshotPage /> },
          { path: "/snapshot/images", element: <SnapshotImagesPage /> },
          { path: "/certificate/index", element: <CertificatePage /> },
          { path: "/certificate/users", element: <CertificateUsersPage /> },
          { path: "/order/index", element: <OrderPage /> },
          { path: "/order/refund", element: <OrderRefundPage /> },
          { path: "/order/detail", element: <OrderDetailPage /> },
          { path: "/order/recharge", element: <OrderRechargePage /> },
          { path: "/withdrawOrders", element: <WithdrawOrdersPage /> },
          { path: "/role", element: <RolePage /> },
          { path: "/addrole", element: <RoleCreatePage /> },
          { path: "/editrole", element: <RoleUpdatePage /> },
          { path: "/creditMall/index", element: <CreditMallPage /> },
          { path: "/creditMall/create", element: <CreditMallCreatePage /> },
          { path: "/creditMall/update", element: <CreditMallUpdatePage /> },
          {
            path: "/creditMall/orders/index",
            element: <CreditMallOrdersPage />,
          },
          {
            path: "/creditMall/orders/update",
            element: <CreditMallOrdersUpdatePage />,
          },
          {
            path: "/creditMall/orders/send",
            element: <CreditMallOrdersSendPage />,
          },
          {
            path: "/multi_level_share/goods/index",
            element: <MultiSharePage />,
          },
          {
            path: "/multi_level_share/goods/create",
            element: <MultiShareCreatePage />,
          },
          {
            path: "/multi_level_share/goods/update",
            element: <MultiShareUpdatePage />,
          },
          {
            path: "/multi_level_share/goods/rewards",
            element: <MultiShareRewardsPage />,
          },
          { path: "/miaosha/goods/index", element: <MiaoshaPage /> },
          { path: "/miaosha/goods/create", element: <MiaoshaCreatePage /> },
          { path: "/miaosha/goods/update", element: <MiaoshaUpdatePage /> },
          { path: "/miaosha/orders/index", element: <MiaoshaOrdersPage /> },
          { path: "/wenda/question/index", element: <WendaPage /> },
          {
            path: "/wenda/question/category/index",
            element: <WendaCategoriesPage />,
          },
          {
            path: "/wenda/question/category/create",
            element: <WendaCategoriesCreatePage />,
          },
          {
            path: "/wenda/question/category/update",
            element: <WendaCategoriesUpdatePage />,
          },
          {
            path: "/wenda/question/answer",
            element: <WendaAnswerPage />,
          },
          { path: "/wenda/question/comment", element: <WendaCommentPage /> },
          { path: "/codeExchanger/index", element: <CodeExchangerPage /> },
          {
            path: "/codeExchanger/create",
            element: <CodeExchangerCreatePage />,
          },
          {
            path: "/codeExchanger/update",
            element: <CodeExchangerUpdatePage />,
          },
          { path: "/codeExchanger/codes", element: <CodeExchangerCodesPage /> },
          { path: "/promocode", element: <PromoCodePage /> },
          { path: "/order/code-import", element: <PromoCodeImportPage /> },
          { path: "/createcode", element: <PromoCodeCreatePage /> },
          { path: "/createmulticode", element: <PromoCodeCreateMultiPage /> },
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
          { path: "/system/index", element: <SystemConfigPage /> },
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
