import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { stats } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { DayWeekMonth } from "../../../components/index";
import moment from "moment";

const StatsMemberPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<any>([]);
  const [start_at, setStartAt] = useState(moment().format("YYYY-MM-DD"));
  const [end_at, setEndAt] = useState(
    moment().add(1, "days").format("YYYY-MM-DD")
  );
  const [topData, setTopData] = useState<any>([]);

  useEffect(() => {
    document.title = "学员数据";
    dispatch(titleAction("学员数据"));
    getStatData();
  }, []);

  useEffect(() => {
    getUserTopData();
  }, [page, size, start_at, end_at]);

  const getStatData = () => {
    stats.memberList({}).then((res: any) => {
      setList(res.data);
    });
  };

  const getUserTopData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    stats
      .userTops({
        start_at: start_at,
        end_at: end_at,
        page: page,
        size: size,
      })
      .then((res: any) => {
        setTopData(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const newSumrate = (num1: number, num2: number) => {
    if (typeof num1 !== "number" || typeof num2 !== "number") {
      return 0;
    }
    if (num1 === 0) {
      // 今天未有增长
      return 0;
    }
    if (num2 === 0) {
      // 昨天无增长，今天有增长 => 100%
      return 100;
    }

    let value: any = ((num1 - num2) / num2).toFixed(2);

    return Math.floor(value * 100);
  };

  const sumrate = (num1: number, num2: number) => {
    if (typeof num1 !== "number" || typeof num2 !== "number") {
      return 0;
    }
    if (num2 === num1) {
      return 100;
    }

    let value: any = (num2 / (num1 - num2)).toFixed(2);

    return Math.floor(value * 100);
  };

  const formatNumber = (num: number) => {
    if (!num) {
      return 0;
    }
    return Number(num).toLocaleString();
  };

  const numberForHuman = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + "亿";
    } else if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + "千万";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "百万";
    } else if (num >= 10000) {
      return (num / 10000).toFixed(2) + "万";
    }
    return num;
  };

  return (
    <>
      <div className={styles["el_content"]}>
        <div className={styles["el_top_row1"]}>
          <div className={styles["el_row_item"]}>
            <span className={styles["item_title"]}>今日录播课学习学员</span>
            <p>{formatNumber(list.today_watch_count || 0)}</p>
            <div className={styles["item_info"]}>
              <span>昨日：{numberForHuman(list.yesterday_watch_count)}</span>
              <span>
                较昨日：
                {newSumrate(
                  list.today_watch_count,
                  list.yesterday_watch_count
                ) < 0 && (
                  <strong className="c-danger">
                    {newSumrate(
                      list.today_watch_count,
                      list.yesterday_watch_count
                    )}
                    %
                  </strong>
                )}
                {newSumrate(
                  list.today_watch_count,
                  list.yesterday_watch_count
                ) >= 0 && (
                  <strong>
                    {newSumrate(
                      list.today_watch_count,
                      list.yesterday_watch_count
                    )}
                    %
                  </strong>
                )}
              </span>
            </div>
          </div>
          <div className={styles["el_row_item"]}>
            <span className={styles["item_title"]}>今日新注册学员</span>
            <p>{formatNumber(list.today_count || 0)}</p>
            <div className={styles["item_info"]}>
              <span>昨日：{numberForHuman(list.yesterday_count)}</span>
              <span>
                较昨日：
                {newSumrate(list.today_count, list.yesterday_count) < 0 && (
                  <strong className="c-danger">
                    {newSumrate(list.today_count, list.yesterday_count)}%
                  </strong>
                )}
                {newSumrate(list.today_count, list.yesterday_count) >= 0 && (
                  <strong>
                    {newSumrate(list.today_count, list.yesterday_count)}%
                  </strong>
                )}
              </span>
            </div>
          </div>
          <div className={styles["el_row_item"]}>
            <span className={styles["item_title"]}>总学员数</span>
            <p>{formatNumber(list.user_count || 0)}</p>
            <div className={styles["item_info"]}>
              <span>昨日：{numberForHuman(list.yesterday_count)}</span>
              <span>
                较上周：
                {sumrate(list.user_count, list.week_count) < 0 && (
                  <strong className="c-danger">
                    {sumrate(list.user_count, list.week_count)}%
                  </strong>
                )}
                {sumrate(list.user_count, list.week_count) >= 0 && (
                  <strong>{sumrate(list.user_count, list.week_count)}%</strong>
                )}
              </span>
              <span>
                较上月：
                {sumrate(list.user_count, list.month_count) < 0 && (
                  <strong className="c-danger">
                    {sumrate(list.user_count, list.month_count)}%
                  </strong>
                )}
                {sumrate(list.user_count, list.month_count) >= 0 && (
                  <strong>{sumrate(list.user_count, list.month_count)}%</strong>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsMemberPage;
