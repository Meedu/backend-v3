import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Row, Col, DatePicker, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { home } from "../../api/index";
import * as echarts from "echarts";
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  let chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [basicData, setBasicData] = useState<any>({});
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [start_at, setStartAt] = useState(0);
  const [end_at, setEndAt] = useState(0);
  const [flagE, setFlagE] = useState(1);

  useEffect(() => {
    getStatData();
    getSystemInfo();
    getZXTdata();
  }, []);

  const getStatData = () => {
    home.index().then((res: any) => {
      setBasicData(res.data);
    });
  };

  const getSystemInfo = () => {
    home.systemInfo().then((res: any) => {
      setSystemInfo(res.data);
    });
  };

  const changeObjectKey = (obj: any) => {
    var arr = [];
    for (let i in obj) {
      arr.push(i); //返回键名
    }
    return arr;
  };

  const changeObject = (obj: any) => {
    let data = Object.values(obj);
    return data;
  };

  const getZXTdata = () => {
    let uid = "userRegister";
    if (flagE == 2) {
      uid = "orderCreated";
    } else if (flagE == 3) {
      uid = "orderPaidCount";
    } else if (flagE == 4) {
      uid = "orderPaidSum";
    } else {
      uid = "userRegister";
    }
    let databox = {
      start_at: start_at,
      end_at: end_at,
    };
    home.statistic(databox).then((res: any) => {
      drawLineChart(res.data);
    });

    return () => {
      window.onresize = null;
    };
  };

  const drawLineChart = (params: any) => {
    let dom: any = chartRef.current;
    let myChart = echarts.init(dom);
    myChart.setOption({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["每日注册用户", "每日创建订单", "每日已支付订单", "每日营收"],
        x: "right",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: changeObjectKey(params.order_created),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "每日注册用户",
          type: "line",
          data: changeObject(params.user_register),
        },
        {
          name: "每日创建订单",
          type: "line",
          data: changeObject(params.order_created),
        },
        {
          name: "每日已支付订单",
          type: "line",
          data: changeObject(params.order_paid),
        },
        {
          name: "每日营收",
          type: "line",
          data: changeObject(params.order_sum),
        },
      ],
    });

    window.onresize = () => {
      myChart.resize();
    };
  };

  const onChange = (date: any, dateString: any) => {
    setStartAt(dateString[0]);
    setEndAt(dateString[1]);
  };

  return (
    <>
      <div className={styles["el_content"]}>
        <div className={styles["el_top_row3"]}>
          <div className={styles["tit"]}>统计分析</div>
          <div className={styles["selcharttimebox"]}>
            <RangePicker format={"YYYY-MM-DD"} onChange={onChange} />
            <Button
              type="primary"
              className="ml-10"
              onClick={() => {
                getZXTdata();
              }}
            >
              筛选
            </Button>
          </div>
          <div className={styles["charts"]}>
            <div
              ref={chartRef}
              style={{ width: "100%", height: 280, position: "relative" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardPage;
