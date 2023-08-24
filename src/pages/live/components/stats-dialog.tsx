import { useEffect, useState, useRef } from "react";
import { Modal } from "antd";
import { live } from "../../../api/index";
import { DurationText } from "../../../components";
import styles from "./stats-dialog.module.scss";
import * as echarts from "echarts";

interface PropsInterface {
  open: boolean;
  id: number;
  onCancel: () => void;
}

export const LiveVideoStatsDialog = (props: PropsInterface) => {
  let chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>({});

  useEffect(() => {
    if (props.open && props.id !== 0) {
      getData();
    }
    return () => {
      window.onresize = null;
    };
  }, [props.open, props.id]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .videoStats(props.id)
      .then((res: any) => {
        setList(res.data);
        drawLineChart(res.data.online_user_count_per_minute);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const drawLineChart = (obj: any) => {
    let xset = [];
    let val = [];
    for (let key in obj) {
      xset.push(key);
      val.push(obj[key]);
    }
    let dom: any = chartRef.current;
    let myChart = echarts.init(dom);
    myChart.setOption({
      title: {
        text: "学员实时在线统计",
        left: "center",
        textStyle: { color: "#333", fontSize: 16 },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xset,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "在线学员数",
          type: "line",
          // 设置折线图颜色
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#4876FF",
              },
            },
          },
          stack: "总量",
          data: val,
        },
      ],
    });

    window.onresize = () => {
      myChart.resize();
    };
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="直播统计"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={1000}
          maskClosable={false}
          footer={null}
          centered
        >
          <div className={styles["live-stats-body"]}>
            <div className={styles["stats-content"]}>
              <div className={styles["border-item"]}>
                <div className={styles["item-name"]}>直播时长</div>
                <div className={styles["item-value"]}>
                  <DurationText duration={list.duration}></DurationText>
                </div>
              </div>
              <div className={styles["border-item"]}>
                <div className={styles["item-name"]}>聊天消息数</div>
                <div className={styles["item-value"]}>
                  {list.count_watch_user}
                </div>
              </div>
              <div className={styles["border-item"]}>
                <div className={styles["item-name"]}>观看总人数</div>
                <div className={styles["item-value"]}>
                  {list.count_watch_user}
                </div>
              </div>
              <div className={styles["item"]}>
                <div className={styles["item-name"]}>学员平均观看时长</div>
                <div className={styles["item-value"]}>
                  <DurationText
                    duration={list.avg_watch_duration}
                  ></DurationText>
                </div>
              </div>
            </div>
            <div className={styles["charts"]}>
              <div
                ref={chartRef}
                style={{
                  width: "100%",
                  height: 280,

                  position: "relative",
                }}
              ></div>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
