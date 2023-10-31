import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login, system } from "../api";
// 页面加载
import InitPage from "../pages/init";
import { getToken } from "../utils";
import LoginPage from "../pages/login";
import WithHeaderWithoutFooter from "../pages/layouts/with-header-without-footer";
import WithoutHeaderWithoutFooter from "../pages/layouts/without-header-without-footer";

//主页
const DashboardPage = lazy(() => import("../pages/dashboard"));
//修改密码页面
const ChangePasswordPage = lazy(
  () => import("../pages/administrator/change-password")
);
//资源相关
const ResourceVideosPage = lazy(() => import("../pages/resource/videos/index"));
const ResourceImagesPage = lazy(() => import("../pages/resource/images/index"));
//录播课相关
const CoursePage = lazy(() => import("../pages/course/index"));
const CourseCreatePage = lazy(() => import("../pages/course/create"));
const CourseUpdatePage = lazy(() => import("../pages/course/update"));
const CourseCategoryPage = lazy(() => import("../pages/course/category/index"));
const CourseCommentsPage = lazy(() => import("../pages/course/comments"));
const CourseVideoCommentsPage = lazy(
  () => import("../pages/course/video/comments")
);
const CourseVideoImportPage = lazy(
  () => import("../pages/course/video/import")
);
const CourseUsersPage = lazy(() => import("../pages/course/users"));
const CourseAttachPage = lazy(() => import("../pages/course/attach/index"));
const CourseAttachCreatePage = lazy(
  () => import("../pages/course/attach/create")
);
const CourseVideoPage = lazy(() => import("../pages/course/video/index"));
const CourseVideoRecordsPage = lazy(
  () => import("../pages/course/video/watch-records")
);
const CourseVideoSubscribePage = lazy(
  () => import("../pages/course/video/subscribe")
);
const CourseChapterPage = lazy(() => import("../pages/course/chapter/index"));
const CourseAliyunPage = lazy(() => import("../pages/course/video/aliyun-hls"));
const CourseTencentPage = lazy(
  () => import("../pages/course/video/tencent-hls")
);
const CourseVideoCreatePage = lazy(
  () => import("../pages/course/video/create")
);
const CourseVideoUpdatePage = lazy(
  () => import("../pages/course/video/update")
);
//直播课相关
const LivePage = lazy(() => import("../pages/live/index"));
const LiveCreatePage = lazy(() => import("../pages/live/create"));
const LiveUpdatePage = lazy(() => import("../pages/live/update"));
const LiveCategoryPage = lazy(() => import("../pages/live/category/index"));
const LiveTeacherPage = lazy(() => import("../pages/live/teacher/index"));
const LiveCommentsPage = lazy(() => import("../pages/live/comment"));
const LiveStatsPage = lazy(() => import("../pages/live/stats"));
const LiveUsersPage = lazy(() => import("../pages/live/users"));
const LiveVideoPage = lazy(() => import("../pages/live/video/index"));
const LiveVideoCreatePage = lazy(() => import("../pages/live/video/create"));
const LiveVideoUpdatePage = lazy(() => import("../pages/live/video/update"));
const LiveChapterPage = lazy(() => import("../pages/live/chapter/index"));
const LiveVideoChatsPage = lazy(() => import("../pages/live/video/chats"));
const LiveVideoUsersPage = lazy(() => import("../pages/live/video/users"));
//电子书相关
const BookPage = lazy(() => import("../pages/book/index"));
const BookCreatePage = lazy(() => import("../pages/book/create"));
const BookUpdatePage = lazy(() => import("../pages/book/update"));
const BookCategoryPage = lazy(() => import("../pages/book/category/index"));
const BookCommentsPage = lazy(() => import("../pages/book/comments"));
const BookArticlePage = lazy(() => import("../pages/book/article/index"));
const BookArticleCreatePage = lazy(
  () => import("../pages/book/article/create")
);
const BookArticleUpdatePage = lazy(
  () => import("../pages/book/article/update")
);
const BookArticleCommentsPage = lazy(
  () => import("../pages/book/article/comments")
);
const BookChapterPage = lazy(() => import("../pages/book/chapter/index"));
const BookUsersPage = lazy(() => import("../pages/book/users"));
//图文相关
const TopicPage = lazy(() => import("../pages/topic/index"));
const TopicCreatePage = lazy(() => import("../pages/topic/create"));
const TopicUpdatePage = lazy(() => import("../pages/topic/update"));
const TopicCategoryPage = lazy(() => import("../pages/topic/category/index"));
const TopicCommentsPage = lazy(() => import("../pages/topic/comment"));
const TopicUsersPage = lazy(() => import("../pages/topic/users"));
//路径相关
const LearnPathPage = lazy(() => import("../pages/learningpath/index"));
const LearnPathCreatePage = lazy(() => import("../pages/learningpath/create"));
const LearnPathUpdatePage = lazy(() => import("../pages/learningpath/update"));
const LearnPathUserPage = lazy(() => import("../pages/learningpath/user"));
const LearnPathCategoryPage = lazy(
  () => import("../pages/learningpath/category/index")
);
const LearnPathStepPage = lazy(
  () => import("../pages/learningpath/step/index")
);
const LearnPathStepCreatePage = lazy(
  () => import("../pages/learningpath/step/create")
);
const LearnPathStepUpdatePage = lazy(
  () => import("../pages/learningpath/step/update")
);
//学员相关
const MemberPage = lazy(() => import("../pages/member/index"));
const MemberImportPage = lazy(() => import("../pages/member/import"));
const MemberDetailPage = lazy(() => import("../pages/member/detail"));
const MemberProfilePage = lazy(() => import("../pages/member/profile"));
const MemberTagsPage = lazy(() => import("../pages/member/tags/index"));
const MemberTagsCreatePage = lazy(() => import("../pages/member/tags/create"));
const MemberTagsUpdatePage = lazy(() => import("../pages/member/tags/update"));
//学习照片
const SnapshotPage = lazy(() => import("../pages/snapshot/index"));
const SnapshotImagesPage = lazy(() => import("../pages/snapshot/images"));
//订单相关
const OrderPage = lazy(() => import("../pages/order/index"));
const OrderRefundPage = lazy(() => import("../pages/order/refund"));
const OrderDetailPage = lazy(() => import("../pages/order/detail"));
const OrderRechargePage = lazy(() => import("../pages/order/recharge"));
const WithdrawOrdersPage = lazy(() => import("../pages/order/withdrawOrders"));
//系统相关
const SystemApplicationPage = lazy(() => import("../pages/system/application"));
const SystemLogPage = lazy(() => import("../pages/system/systemLog/index"));
const SystemAdministratorPage = lazy(
  () => import("../pages/system/administrator/index")
);
const SystemAdministratorCreatePage = lazy(
  () => import("../pages/system/administrator/create")
);
const SystemAdministratorUpdatePage = lazy(
  () => import("../pages/system/administrator/update")
);
const SystemAdminrolesPage = lazy(
  () => import("../pages/system/adminroles/index")
);
const SystemAdminrolesCreatePage = lazy(
  () => import("../pages/system/adminroles/create")
);
const SystemAdminrolesUpdatePage = lazy(
  () => import("../pages/system/adminroles/update")
);
//数据统计
const StatsTransactionPage = lazy(() => import("../pages/stats/transaction"));
const StatsContentPage = lazy(() => import("../pages/stats/content"));
const StatsMemberPage = lazy(() => import("../pages/stats/member"));
//会员相关
const RolePage = lazy(() => import("../pages/role/index"));
const RoleCreatePage = lazy(() => import("../pages/role/create"));
const RoleUpdatePage = lazy(() => import("../pages/role/update"));
//公众号
const WechatPage = lazy(() => import("../pages/wechat/index"));
const WechatCreatePage = lazy(() => import("../pages/wechat/create"));
const WechatUpdatePage = lazy(() => import("../pages/wechat/update"));
const WechatMenuPage = lazy(
  () => import("../pages/wechat/mp-wechat-menu/index")
);
//优惠码
const PromoCodePage = lazy(() => import("../pages/promocode/index"));
const PromoCodeImportPage = lazy(() => import("../pages/promocode/import"));
const PromoCodeCreateMultiPage = lazy(
  () => import("../pages/promocode/create-multi")
);
const PromoCodeCreatePage = lazy(() => import("../pages/promocode/create"));
//问答相关
const WendaPage = lazy(() => import("../pages/wenda/index"));
const WendaCategoriesPage = lazy(() => import("../pages/wenda/category/index"));
const WendaCategoriesCreatePage = lazy(
  () => import("../pages/wenda/category/create")
);
const WendaCategoriesUpdatePage = lazy(
  () => import("../pages/wenda/category/update")
);
const WendaAnswerPage = lazy(() => import("../pages/wenda/answer"));
const WendaCommentPage = lazy(() => import("../pages/wenda/comment"));
//分销活动
const MultiSharePage = lazy(() => import("../pages/multi_level_share/index"));
const MultiShareRewardsPage = lazy(
  () => import("../pages/multi_level_share/rewards")
);
const MultiShareCreatePage = lazy(
  () => import("../pages/multi_level_share/create")
);
const MultiShareUpdatePage = lazy(
  () => import("../pages/multi_level_share/update")
);
//兑换活动
const CodeExchangerPage = lazy(() => import("../pages/codeExchanger/index"));
const CodeExchangerCreatePage = lazy(
  () => import("../pages/codeExchanger/create")
);
const CodeExchangerUpdatePage = lazy(
  () => import("../pages/codeExchanger/update")
);
const CodeExchangerCodesPage = lazy(
  () => import("../pages/codeExchanger/codes")
);
//秒杀活动
const MiaoshaPage = lazy(() => import("../pages/miaosha/index"));
const MiaoshaCreatePage = lazy(() => import("../pages/miaosha/create"));
const MiaoshaUpdatePage = lazy(() => import("../pages/miaosha/update"));
const MiaoshaOrdersPage = lazy(() => import("../pages/miaosha/orders"));
//团购活动
const TuangouPage = lazy(() => import("../pages/tuangou/index"));
const TuangouCreatePage = lazy(() => import("../pages/tuangou/create"));
const TuangouUpdatePage = lazy(() => import("../pages/tuangou/update"));
const TuangouOrdersPage = lazy(() => import("../pages/tuangou/orders"));
const TuangouRefundPage = lazy(() => import("../pages/tuangou/refund"));
const TuangouTuanOrderPage = lazy(() => import("../pages/tuangou/tuanorder"));
const TuangouTuanDetailPage = lazy(() => import("../pages/tuangou/detail"));
// /积分商城
const CreditMallPage = lazy(() => import("../pages/creditMall/index"));
const CreditMallCreatePage = lazy(() => import("../pages/creditMall/create"));
const CreditMallUpdatePage = lazy(() => import("../pages/creditMall/update"));
const CreditMallOrdersPage = lazy(
  () => import("../pages/creditMall/orders/index")
);
const CreditMallOrdersUpdatePage = lazy(
  () => import("../pages/creditMall/orders/update")
);
const CreditMallOrdersSendPage = lazy(
  () => import("../pages/creditMall/orders/send")
);
//系统配置
const SystemConfigPage = lazy(() => import("../pages/system/config/index"));
const SystemPlayerConfigPage = lazy(
  () => import("../pages/system/config/playerConfig")
);
const SystemLiveConfigPage = lazy(
  () => import("../pages/system/config/liveConfig")
);
const SystemPaymentConfigPage = lazy(
  () => import("../pages/system/config/paymentConfig")
);
const SystemMpWechatConfigPage = lazy(
  () => import("../pages/system/config/mp_wechatConfig")
);
const SystemMessageConfigPage = lazy(
  () => import("../pages/system/config/messageConfig")
);
const SystemVideoSaveConfigPage = lazy(
  () => import("../pages/system/config/videoSaveConfig")
);
const SystemImagesSaveConfigPage = lazy(
  () => import("../pages/system/config/saveImagesConfig")
);
const SystemvVideoHlsConfigPage = lazy(
  () => import("../pages/system/config/videoHlsConfig")
);
const SystemWechatMiniConfigPage = lazy(
  () => import("../pages/system/config/wechat_miniConfig")
);
const SystemIOSConfigPage = lazy(
  () => import("../pages/system/config/iosConfig")
);
const SystemCreditSignConfigPage = lazy(
  () => import("../pages/system/config/creditSignConfig")
);
const SystemNormalConfigPage = lazy(
  () => import("../pages/system/config/config")
);
const SystemTopicConfigPage = lazy(
  () => import("../pages/system/config/topicConfig")
);
const SystemBookConfigPage = lazy(
  () => import("../pages/system/config/bookConfig")
);
const ErrorPage = lazy(() => import("../pages/error"));
//考试练习相关
const PaperCategoryPage = lazy(() => import("../pages/exam/category/index"));
const PracticePage = lazy(() => import("../pages/exam/practice/index"));
const PracticeCreatePage = lazy(() => import("../pages/exam/practice/create"));
const PracticeUpdatePage = lazy(() => import("../pages/exam/practice/update"));
const PracticeUsersPage = lazy(() => import("../pages/exam/practice/user"));
const PracticeUsersProgressPage = lazy(
  () => import("../pages/exam/practice/progress")
);
const PracticeChaptersPage = lazy(
  () => import("../pages/exam/practice/chapter/index")
);
const PracticeChapterCreatePage = lazy(
  () => import("../pages/exam/practice/chapter/create")
);
const PracticeChapterUpdatePage = lazy(
  () => import("../pages/exam/practice/chapter/update")
);
const PracticeQuestionPage = lazy(
  () => import("../pages/exam/practice/chapter/question")
);
const PracticeQuestionCreatePage = lazy(
  () => import("../pages/exam/practice/chapter/questionCreate")
);
//考试模拟相关
const MockPaperPage = lazy(() => import("../pages/exam/mockpaper/index"));
const MockPaperUsersPage = lazy(() => import("../pages/exam/mockpaper/users"));
const MockPaperCreatePage = lazy(
  () => import("../pages/exam/mockpaper/create")
);
const MockPaperUpdatePage = lazy(
  () => import("../pages/exam/mockpaper/update")
);
const MockPaperReadPage = lazy(
  () => import("../pages/exam/mockpaper/paperShow")
);
//考试试卷相关
const PaperPage = lazy(() => import("../pages/exam/paper/index"));
const PaperCreatePage = lazy(() => import("../pages/exam/paper/create"));
const PaperUpdatePage = lazy(() => import("../pages/exam/paper/update"));
const PaperUsersPage = lazy(() => import("../pages/exam/paper/users"));
const PaperQuestionPage = lazy(() => import("../pages/exam/paper/question"));
const PaperQuestionCreatePage = lazy(
  () => import("../pages/exam/paper/questionadd")
);
const PaperReadPage = lazy(() => import("../pages/exam/paper/paperShow"));
const PaperMarkingPage = lazy(() => import("../pages/exam/paper/marking"));
//考试题库相关
const QuestionPage = lazy(() => import("../pages/exam/question/index"));
const QuestionCategoryPage = lazy(
  () => import("../pages/exam/question/category/index")
);
const QuestionImportPage = lazy(() => import("../pages/exam/question/import"));
const QuestionCreatePage = lazy(() => import("../pages/exam/question/create"));
const QuestionUpdatePage = lazy(() => import("../pages/exam/question/update"));
//单页面
const SinglePage = lazy(() => import("../pages/singlepage/index"));
const SingleCreatePage = lazy(() => import("../pages/singlepage/create"));
const SingleUpdatePage = lazy(() => import("../pages/singlepage/update"));
//证书相关
const CertificatePage = lazy(() => import("../pages/certificate/index"));
const CertificateUsersPage = lazy(() => import("../pages/certificate/users"));
const CertificateCreatePage = lazy(() => import("../pages/certificate/create"));
const CertificateUpdatePage = lazy(() => import("../pages/certificate/update"));
//装修
const DecorationPCPage = lazy(() => import("../pages/decoration/pc"));
const DecorationH5Page = lazy(() => import("../pages/decoration/h5"));

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
        element: <WithHeaderWithoutFooter />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/administrator/change-password",
            element: <ChangePasswordPage />,
          },
          { path: "/resource/videos/index", element: <ResourceVideosPage /> },
          { path: "/resource/images/index", element: <ResourceImagesPage /> },
          { path: "/course/vod/index", element: <CoursePage /> },
          { path: "/course/vod/create", element: <CourseCreatePage /> },
          { path: "/course/vod/update", element: <CourseUpdatePage /> },
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
          {
            path: "/course/vod/video/create",
            element: <CourseVideoCreatePage />,
          },
          {
            path: "/course/vod/video/update",
            element: <CourseVideoUpdatePage />,
          },
          { path: "/live/course/index", element: <LivePage /> },
          { path: "/live/course/create", element: <LiveCreatePage /> },
          { path: "/live/course/update", element: <LiveUpdatePage /> },
          {
            path: "/live/course/category/index",
            element: <LiveCategoryPage />,
          },
          { path: "/live/teacher/index", element: <LiveTeacherPage /> },
          { path: "/live/course/comment", element: <LiveCommentsPage /> },
          { path: "/live/course/stat", element: <LiveStatsPage /> },
          { path: "/live/course/users/index", element: <LiveUsersPage /> },
          { path: "/live/course/video/index", element: <LiveVideoPage /> },
          {
            path: "/live/course/video/create",
            element: <LiveVideoCreatePage />,
          },
          {
            path: "/live/course/video/update",
            element: <LiveVideoUpdatePage />,
          },
          { path: "/live/course/chapter/index", element: <LiveChapterPage /> },
          { path: "/live/course/video/chats", element: <LiveVideoChatsPage /> },
          { path: "/live/course/video/users", element: <LiveVideoUsersPage /> },
          { path: "/meedubook/book/index", element: <BookPage /> },
          { path: "/meedubook/book/create", element: <BookCreatePage /> },
          { path: "/meedubook/book/update", element: <BookUpdatePage /> },
          { path: "/meedubook/category/index", element: <BookCategoryPage /> },
          { path: "/meedubook/book/comment", element: <BookCommentsPage /> },
          { path: "/meedubook/article/index", element: <BookArticlePage /> },
          {
            path: "/meedubook/article/create",
            element: <BookArticleCreatePage />,
          },
          {
            path: "/meedubook/article/update",
            element: <BookArticleUpdatePage />,
          },
          {
            path: "/meedubook/article/comment",
            element: <BookArticleCommentsPage />,
          },
          { path: "/meedubook/book/users", element: <BookUsersPage /> },
          { path: "/meedubook/chapter/index", element: <BookChapterPage /> },
          { path: "/topic/index", element: <TopicPage /> },
          { path: "/topic/create", element: <TopicCreatePage /> },
          { path: "/topic/update", element: <TopicUpdatePage /> },
          { path: "/topic/category/index", element: <TopicCategoryPage /> },
          { path: "/topic/comment", element: <TopicCommentsPage /> },
          { path: "/topic/order", element: <TopicUsersPage /> },
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
            element: <MemberProfilePage />,
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
          { path: "/tuangou/goods/index", element: <TuangouPage /> },
          { path: "/tuangou/goods/create", element: <TuangouCreatePage /> },
          { path: "/tuangou/goods/update", element: <TuangouUpdatePage /> },
          { path: "/tuangou/goods/order", element: <TuangouOrdersPage /> },
          { path: "/tuangou/goods/refund", element: <TuangouRefundPage /> },
          {
            path: "/tuangou/goods/tuanorder",
            element: <TuangouTuanOrderPage />,
          },
          { path: "/tuangou/goods/detail", element: <TuangouTuanDetailPage /> },
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
            path: "/wechat/mp-wechat-menu",
            element: <WechatMenuPage />,
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
          { path: "/system/playerConfig", element: <SystemPlayerConfigPage /> },
          { path: "/system/liveConfig", element: <SystemLiveConfigPage /> },
          {
            path: "/system/paymentConfig",
            element: <SystemPaymentConfigPage />,
          },
          {
            path: "/system/mp_wechatConfig",
            element: <SystemMpWechatConfigPage />,
          },
          {
            path: "/system/messageConfig",
            element: <SystemMessageConfigPage />,
          },
          {
            path: "/system/videoSaveConfig",
            element: <SystemVideoSaveConfigPage />,
          },
          {
            path: "/system/saveImagesConfig",
            element: <SystemImagesSaveConfigPage />,
          },
          {
            path: "/system/videoHlsConfig",
            element: <SystemvVideoHlsConfigPage />,
          },
          {
            path: "/system/wechat_miniConfig",
            element: <SystemWechatMiniConfigPage />,
          },
          { path: "/system/iosConfig", element: <SystemIOSConfigPage /> },
          {
            path: "/system/creditSignConfig",
            element: <SystemCreditSignConfigPage />,
          },
          { path: "/system/config", element: <SystemNormalConfigPage /> },
          { path: "/system/topicConfig", element: <SystemTopicConfigPage /> },
          { path: "/system/bookConfig", element: <SystemBookConfigPage /> },
          {
            path: "/exam/paper/category/index",
            element: <PaperCategoryPage />,
          },
          { path: "/exam/practice/index", element: <PracticePage /> },
          { path: "/exam/practice/create", element: <PracticeCreatePage /> },
          { path: "/exam/practice/update", element: <PracticeUpdatePage /> },
          { path: "/exam/practice/user", element: <PracticeUsersPage /> },
          {
            path: "/exam/practice/progress",
            element: <PracticeUsersProgressPage />,
          },
          {
            path: "/exam/practice/chapter/index",
            element: <PracticeChaptersPage />,
          },
          {
            path: "/exam/practice/chapter/create",
            element: <PracticeChapterCreatePage />,
          },
          {
            path: "/exam/practice/chapter/update",
            element: <PracticeChapterUpdatePage />,
          },
          {
            path: "/exam/practice/chapter/question/index",
            element: <PracticeQuestionPage />,
          },
          {
            path: "/exam/practice/chapter/question/create",
            element: <PracticeQuestionCreatePage />,
          },
          { path: "/exam/mockpaper/index", element: <MockPaperPage /> },
          { path: "/exam/mockpaper/user", element: <MockPaperUsersPage /> },
          { path: "/exam/mockpaper/create", element: <MockPaperCreatePage /> },
          { path: "/exam/mockpaper/update", element: <MockPaperUpdatePage /> },
          { path: "/exam/mockpaper/paperShow", element: <MockPaperReadPage /> },
          { path: "/exam/paper/index", element: <PaperPage /> },
          { path: "/exam/paper/create", element: <PaperCreatePage /> },
          { path: "/exam/paper/update", element: <PaperUpdatePage /> },
          { path: "/exam/paper/user", element: <PaperUsersPage /> },
          { path: "/exam/paper/question", element: <PaperQuestionPage /> },
          {
            path: "/exam/paper/questionadd",
            element: <PaperQuestionCreatePage />,
          },
          { path: "/exam/paper/paperShow", element: <PaperReadPage /> },
          { path: "/exam/paper/marking", element: <PaperMarkingPage /> },
          { path: "/exam/question/index", element: <QuestionPage /> },
          {
            path: "/exam/question/category/index",
            element: <QuestionCategoryPage />,
          },
          { path: "/exam/question/import", element: <QuestionImportPage /> },
          { path: "/exam/question/create", element: <QuestionCreatePage /> },
          { path: "/exam/question/update", element: <QuestionUpdatePage /> },
          { path: "/singlepage/index", element: <SinglePage /> },
          { path: "/singlepage/create", element: <SingleCreatePage /> },
          { path: "/singlepage/update", element: <SingleUpdatePage /> },
        ],
      },
      {
        path: "/",
        element: <WithoutHeaderWithoutFooter />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          { path: "/certificate/create", element: <CertificateCreatePage /> },
          { path: "/certificate/update", element: <CertificateUpdatePage /> },
          { path: "/decoration/pc", element: <DecorationPCPage /> },
          { path: "/decoration/h5", element: <DecorationH5Page /> },
          {
            path: "*",
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
