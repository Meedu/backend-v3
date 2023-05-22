import { useState, useEffect } from "react";
import { message, Button, Space, Modal, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./detail.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { member } from "../../api/index";
import { PerButton, BackBartment } from "../../components";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";

const MemberDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({});
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    document.title = "学员详情";
    dispatch(titleAction("学员详情"));
  }, []);

  useEffect(() => {
    getUser();
  }, [params.memberId]);

  const getUser = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .detail(Number(params.memberId))
      .then((res: any) => {
        setUserData(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const lockMember = () => {};

  const changeCredit = () => {};

  const changeTags = () => {};

  const changeRemark = () => {};

  const rechargeIOSCredit = () => {};

  return (
    <div className={styles["user-main-body"]}>
      <div className="float-left bg-white br-15 p-30">
        <BackBartment title="学员详情" />
        <div className={styles["user-info-box"]}>
          <div className={styles["user-base-info-box"]}>
            <div className={styles["user-avatar"]}>
              <img src={userData.avatar} width={80} height={80} />
            </div>
            <div className={styles["user-info"]}>
              <div className={styles["user-nickname"]}>
                {userData.nick_name}
              </div>
              <div className={styles["buttons"]}>
                <Button type="link" className={styles["real-profile"]}>
                  修改资料
                </Button>
                <Button
                  type="link"
                  className={styles["edit-profile"]}
                  onClick={() => navigate("/member/profile")}
                >
                  实名信息
                </Button>
                <PerButton
                  type="link"
                  text={userData.is_lock === 1 ? "解冻账号" : "冻结账号"}
                  class={styles["edit-profile"]}
                  icon={null}
                  p="member.update"
                  onClick={() => {
                    lockMember();
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="变动积分"
                  class={styles["edit-profile"]}
                  icon={null}
                  p="member.credit1.change"
                  onClick={() => {
                    changeCredit();
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="修改标签"
                  class={styles["edit-profile"]}
                  icon={null}
                  p="member.tags"
                  onClick={() => {
                    changeTags();
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="修改备注"
                  class={styles["edit-profile"]}
                  icon={null}
                  p="member.remark.update"
                  onClick={() => {
                    changeRemark();
                  }}
                  disabled={null}
                />
                {enabledAddons["TemplateOne"] && (
                  <PerButton
                    type="link"
                    text="变动iOS余额"
                    class={styles["edit-profile"]}
                    icon={null}
                    p="addons.TemplateOne.memberCredit2.recharge"
                    onClick={() => {
                      rechargeIOSCredit();
                    }}
                    disabled={null}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles["panel-info-box"]}>
            <div className={styles["panel-info-item"]}>ID：{userData.id}</div>
            <div className={styles["panel-info-item"]}>
              手机号：{userData.mobile}
            </div>
            <div className={styles["panel-info-item"]}>
              VIP： {userData.role ? userData.role.name : ""}
            </div>
            <div className={styles["panel-info-item"]}>
              VIP到期：{dateFormat(userData.role_expired_at)}
            </div>
            <div className={styles["panel-info-item"]}>
              账号状态：
              {userData.is_lock === 1 && <span className="c-red">已冻结</span>}
              {userData.is_lock !== 1 && <span className="c-green">正常</span>}
            </div>
            <div className={styles["panel-info-item"]}>
              注册区域：{userData.register_area}
            </div>
            <div className={styles["panel-info-item"]}>
              最近登录：{dateFormat(userData.updated_at)}
            </div>
            <div className={styles["panel-info-item"]}>
              注册IP：{userData.register_ip}
            </div>
            <div className={styles["panel-info-item"]}>
              邀请人：
              {userData.invitor ? userData.invitor.nick_name : ""}
              {userData.invito && (
                <div className="item">
                  (截{dateFormat(userData.invite_user_expired_at)})
                </div>
              )}
            </div>
            <div className={styles["panel-info-item"]}>
              推广分销余额：{userData.invite_balance}
            </div>
            <div className={styles["panel-info-item"]}>
              积分：
              <span>{userData.credit1}</span>
            </div>
            <div className={styles["panel-info-item"]}>
              iOS余额：
              <span>{userData.credit2}</span>
            </div>
            <div className={styles["panel-info-item"]}>
              用户标签：
              {userData.tags &&
                userData.tags.length > 0 &&
                userData.tags.map((item: any) => (
                  <Tag key={item.id} color="processing" className="ml-5 mb-5">
                    {item.name}
                  </Tag>
                ))}
            </div>
            <div className={styles["panel-info-item"]}>
              备注：
              {userData.remark && (
                <div
                  className={styles["remark-text"]}
                  dangerouslySetInnerHTML={{ __html: userData.remark.remark }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="float-left bg-white br-15 p-30 mt-30"></div>
    </div>
  );
};

export default MemberDetailPage;
