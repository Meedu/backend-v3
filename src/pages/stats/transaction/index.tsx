import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Row, Col, DatePicker, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { stats } from "../../../api/index";
import * as echarts from "echarts";
import { titleAction } from "../../../store/user/loginUserSlice";
import moment from "moment";

const StatsTransactionPage = () => {
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
    document.title = "交易数据";
    dispatch(titleAction("交易数据"));
    getStatData();
  }, []);

  const getStatData = () => {
    stats.transactionList({}).then((res: any) => {
      setList(res.data);
    });
  };

  const formatNumber = (num: number) => {
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

  const todayPaidSingle = () => {
    if (
      typeof list.today_paid_sum !== "number" ||
      typeof list.today_paid_user_count !== "number"
    ) {
      return 0;
    }
    if (list.today_paid_user_count === 0) {
      return 0;
    }

    let value: any = list.today_paid_sum / list.today_paid_user_count;

    return parseInt(value);
  };

  const yesterdayPaidSingle = () => {
    if (
      typeof list.yesterday_paid_sum !== "number" ||
      typeof list.yesterday_paid_user_count !== "number"
    ) {
      return 0;
    }
    if (list.yesterday_paid_user_count === 0) {
      return 0;
    }
    let value: any = list.yesterday_paid_sum / list.yesterday_paid_user_count;

    return parseInt(value);
  };

  const todayPaidConversion = () => {
    if (
      typeof list.today_paid_count !== "number" ||
      typeof list.today_count !== "number"
    ) {
      return 0;
    }
    if (list.today_count === 0) {
      return 0;
    }

    let value: any = (list.today_paid_count / list.today_count).toFixed(2);

    return Math.floor(value * 100);
  };

  const yesterdayPaidConversion = () => {
    if (
      typeof list.yesterday_paid_count !== "number" ||
      typeof list.yesterday_count !== "number"
    ) {
      return 0;
    }
    if (list.yesterday_count === 0) {
      return 0;
    }

    let value: any = (
      list.yesterday_paid_countt / list.yesterday_count
    ).toFixed(2);

    return Math.floor(value * 100);
  };

  return (
    <>
      <div className={styles["el_content"]}>
        <div className={styles["el_top_row1"]}>
          <div className={styles["el_row_item"]}>
            <span className={styles["item_title"]}>今日收入(元)</span>
            <p>{formatNumber(list.today_paid_sum || 0)}</p>
            <div className={styles["item_info"]}>
              <span>昨日：{numberForHuman(list.yesterday_paid_sum)}</span>
              <span>
                较昨日：
                {newSumrate(list.today_paid_sum, list.yesterday_paid_sum) <
                  0 && (
                  <strong className="c-danger">
                    {newSumrate(list.today_paid_sum, list.yesterday_paid_sum)}%
                  </strong>
                )}
                {newSumrate(list.today_paid_sum, list.yesterday_paid_sum) >=
                  0 && (
                  <strong>
                    {newSumrate(list.today_paid_sum, list.yesterday_paid_sum)}%
                  </strong>
                )}
              </span>
              <span>
                退款金额：
                <strong className="c-danger">{list.today_refund_sum}</strong>
              </span>
            </div>
          </div>
          <div className={styles["el_row_item"]}>
            <span className={styles["item_title"]}>今日支付订单数</span>
            <p>{formatNumber(list.today_paid_count || 0)}</p>
            <div className={styles["item_info"]}>
              <span>昨日：{numberForHuman(list.yesterday_paid_count)}</span>
              <span>
                较昨日：
                {newSumrate(list.today_paid_count, list.yesterday_paid_count) <
                  0 && (
                  <strong className="c-danger">
                    {newSumrate(
                      list.today_paid_count,
                      list.yesterday_paid_count
                    )}
                    %
                  </strong>
                )}
                {newSumrate(list.today_paid_count, list.yesterday_paid_count) >=
                  0 && (
                  <strong>
                    {newSumrate(
                      list.today_paid_count,
                      list.yesterday_paid_count
                    )}
                    %
                  </strong>
                )}
              </span>
              <span>
                退款订单数：
                <strong className="c-danger">{list.today_refund_count}</strong>
              </span>
            </div>
          </div>
          <div className={styles["el_row_item2"]}>
            <div className={styles["el_item"]}>
              <div className={styles["item_title"]}>
                <span>客单价(元)</span>
                <span className={styles["el_item_num"]}>
                  {todayPaidSingle()}
                </span>
              </div>
              <span className={styles["el_item_increase"]}>
                昨日：{yesterdayPaidSingle()}
              </span>
              <span className={styles["el_item_increase"]}>
                较昨日：
                {newSumrate(todayPaidSingle(), yesterdayPaidSingle()) < 0 && (
                  <strong className="c-danger">
                    {newSumrate(todayPaidSingle(), yesterdayPaidSingle())}%
                  </strong>
                )}
                {newSumrate(todayPaidSingle(), yesterdayPaidSingle()) >= 0 && (
                  <strong>
                    {newSumrate(todayPaidSingle(), yesterdayPaidSingle())}%
                  </strong>
                )}
              </span>
            </div>
            <div className={styles["el_item"]}>
              <div className={styles["item_title"]}>
                <span>今日支付人数</span>
                <span className={styles["el_item_num"]}>
                  {formatNumber(list.today_paid_user_count)}
                </span>
              </div>
              <span className={styles["el_item_increase"]}>
                昨日：{numberForHuman(list.yesterday_paid_user_count)}
              </span>
              <span className={styles["el_item_increase"]}>
                较昨日：
                {newSumrate(
                  list.today_paid_user_count,
                  list.yesterday_paid_user_count
                ) < 0 && (
                  <strong className="c-danger">
                    {newSumrate(
                      list.today_paid_user_count,
                      list.yesterday_paid_user_count
                    )}
                    %
                  </strong>
                )}
                {newSumrate(
                  list.today_paid_user_count,
                  list.yesterday_paid_user_count
                ) >= 0 && (
                  <strong>
                    {newSumrate(
                      list.today_paid_user_count,
                      list.yesterday_paid_user_count
                    )}
                    %
                  </strong>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className={styles["el_top_row2"]}>
          <div className={styles["el_row_left"]}>
            <div className={styles["header"]}>
              <div className={styles["item_title"]}>
                <span>交易过程统计</span>
              </div>
            </div>
            <div className={styles["data-box"]}>
              <div className={styles["data-item"]}>
                <div className={styles["tit"]}>
                  <span>提交订单数</span>
                </div>
                <div className={styles["num"]}>
                  {formatNumber(list.today_count)}
                </div>
                <div className={styles["info-t"]}>
                  昨日：{numberForHuman(list.yesterday_count)}
                </div>
                <div className={styles["info"]}>
                  较昨日：
                  {newSumrate(list.today_count, list.yesterday_count) < 0 && (
                    <span className="c-danger">
                      {newSumrate(list.today_count, list.yesterday_count)}%
                    </span>
                  )}
                  {newSumrate(list.today_count, list.yesterday_count) >= 0 && (
                    <span>
                      {newSumrate(list.today_count, list.yesterday_count)}%
                    </span>
                  )}
                </div>
              </div>
              <div className={styles["row-line"]}></div>
              <div className={styles["data-item"]}>
                <div className={styles["tit"]}>
                  <span>支付订单数</span>
                </div>
                <div className={styles["num"]}>
                  {formatNumber(list.today_paid_count)}
                </div>
                <div className={styles["info-t"]}>
                  昨日：{numberForHuman(list.yesterday_paid_count)}
                </div>
                <div className={styles["info"]}>
                  较昨日：
                  {newSumrate(
                    list.today_paid_count,
                    list.yesterday_paid_count
                  ) < 0 && (
                    <span className="c-danger">
                      {newSumrate(
                        list.today_paid_count,
                        list.yesterday_paid_count
                      )}
                      %
                    </span>
                  )}
                  {newSumrate(
                    list.today_paid_count,
                    list.yesterday_paid_count
                  ) >= 0 && (
                    <span>
                      {newSumrate(
                        list.today_paid_count,
                        list.yesterday_paid_count
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>
              <div className={styles["row-line"]}></div>
              <div className={styles["data-item"]}>
                <div className={styles["tit"]}>
                  <span>支付转化率</span>
                </div>
                <div className={styles["num"]}>{todayPaidConversion()}</div>
                <div className={styles["info-t"]}>
                  昨日：{yesterdayPaidConversion()}
                </div>
                <div className={styles["info"]}>
                  较昨日：
                  {newSumrate(
                    todayPaidConversion(),
                    yesterdayPaidConversion()
                  ) < 0 && (
                    <span className="c-danger">
                      {newSumrate(
                        todayPaidConversion(),
                        yesterdayPaidConversion()
                      )}
                      %
                    </span>
                  )}
                  {newSumrate(
                    todayPaidConversion(),
                    yesterdayPaidConversion()
                  ) >= 0 && (
                    <span>
                      {newSumrate(
                        todayPaidConversion(),
                        yesterdayPaidConversion()
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles["el_row_right"]}>
            <div className={styles["el_row_right_item"]}>
              <div className={styles["header"]}>
                <div className={styles["item_title"]}>
                  <span>Top5销售额</span>
                </div>
                <div className={styles["controls"]}></div>
              </div>
              <div className={styles["top-list"]}>
                {topData.length === 0 && (
                  <div className={styles["none"]}>
                    <span>暂无数据</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsTransactionPage;
