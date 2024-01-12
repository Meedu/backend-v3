import { useEffect, useState } from "react";
import { Table, Button, DatePicker, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { paper } from "../../../../api/index";
import { dateFormat } from "../../../../utils/index";
import moment from "moment";
const { RangePicker } = DatePicker;
import * as XLSX from "xlsx";
import dayjs from "dayjs";

interface DataType {
  id: React.Key;
  created_at: string;
  submit_at: string;
}

interface PropsInterface {
  id: number;
}

interface StatInterface {
  average?: number;
  max?: number;
  min?: number;
  pass_count?: number;
  pass_rate?: number;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  created_at?: any;
  watched_at?: any;
}

export const Statistics = (props: PropsInterface) => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    watched_at: "[]",
    created_at: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const [created_at, setCreatedAt] = useState<any>(
    JSON.parse(searchParams.get("created_at") || "[]")
  );
  const [createdAts, setCreatedAts] = useState<any>(
    created_at.length > 0
      ? [dayjs(created_at[0], "YYYY-MM-DD"), dayjs(created_at[1], "YYYY-MM-DD")]
      : []
  );
  const [watched_at, setWatchedAt] = useState<any>(
    JSON.parse(searchParams.get("watched_at") || "[]")
  );
  const [watchedAts, setWatchedAts] = useState<any>(
    watched_at.length > 0
      ? [dayjs(watched_at[0], "YYYY-MM-DD"), dayjs(watched_at[1], "YYYY-MM-DD")]
      : []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState<any>({});
  const [pass_score, setPassScore] = useState(0);
  const [total_score, setTotalScore] = useState(0);
  const [stat, setStat] = useState<StatInterface>();

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    let time = [...created_at];
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    let time2 = [...watched_at];
    if (time2.length > 0) {
      time2[1] += " 23:59:59";
    }
    setLoading(true);
    paper
      .stats(props.id, {
        page: page,
        size: size,
        created_at: time,
        submit_at: time2,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setUsers(res.data.users);
        setStat(res.data.stat);
        setPassScore(res.data.pass_score);
        setTotalScore(res.data.total_score);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.watched_at !== "undefined") {
          prev.set("watched_at", JSON.stringify(params.watched_at));
        }
        if (typeof params.created_at !== "undefined") {
          prev.set("created_at", JSON.stringify(params.created_at));
        }
        if (typeof params.page !== "undefined") {
          prev.set("page", params.page + "");
        }
        if (typeof params.size !== "undefined") {
          prev.set("size", params.size + "");
        }
        return prev;
      },
      { replace: true }
    );
  };

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      created_at: [],
      watched_at: [],
    });
    setList([]);
    setWatchedAts([]);
    setWatchedAt([]);
    setCreatedAts([]);
    setCreatedAt([]);
    setRefresh(!refresh);
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员ID",
      width: 120,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "学员",
      width: 300,
      render: (_, record: any) => (
        <>
          {users[record.user_id] && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img
                  src={users[record.user_id].avatar}
                  width="40"
                  height="40"
                />
              </div>
              <div className="ml-10">{users[record.user_id].nick_name}</div>
            </div>
          )}
          {!users[record.user_id] && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: "最高得分",
      render: (_, record: any) => <span>{record.score}分</span>,
    },
    {
      title: "及格",
      render: (_, record: any) => (
        <>
          {record.score >= pass_score ? (
            <span>及格</span>
          ) : (
            <span className="c-red">不及格</span>
          )}
        </>
      ),
    },
    {
      title: "开始时间",
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "交卷时间",
      dataIndex: "submit_at",
      render: (submit_at: string) => <span>{dateFormat(submit_at)}</span>,
    },
  ];

  const importexcel = () => {
    if (loading) {
      return;
    }
    let time = [...created_at];
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    let time2 = [...watched_at];
    if (time2.length > 0) {
      time2[1] += " 23:59:59";
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      created_at: time,
      submit_at: time2,
    };
    paper.stats(props.id, params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename =
        "成绩导出|" + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx";
      let sheetName = "默认";

      let rows = [["用户ID", "用户名", "账号", "分数", "及格", "时间"]];
      res.data.data.forEach((item: any) => {
        let user = res.data.users[item.user_id];
        if (typeof user === "undefined") {
          return;
        }

        let isPass = item.score >= res.data.pass_score ? "是" : "否";

        rows.push([
          item.user_id,
          user.nick_name,
          user.mobile,
          item.score + "分",
          isPass,
          item.created_at,
        ]);
      });

      // 总结
      rows.push(["", "", ""]);
      rows.push(["最低分", res.data.stat.min + "分"]);
      rows.push(["最高分", res.data.stat.max + "分"]);
      rows.push(["平均分", res.data.stat.average + "分"]);
      rows.push(["总人数", res.data.total + "人"]);
      rows.push(["及格分", res.data.pass_score + "分"]);
      rows.push(["及格人数", res.data.stat.pass_count + "人"]);
      rows.push(["及格率", res.data.stat.pass_rate + "%"]);

      const jsonWorkSheet = XLSX.utils.json_to_sheet(rows);
      const workBook: XLSX.WorkBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: jsonWorkSheet,
        },
      };
      XLSX.writeFile(workBook, filename);
      setLoading(false);
    });
  };

  return (
    <div className="float-left">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <Button type="primary" onClick={() => importexcel()}>
            导出成绩
          </Button>
        </div>
        <div className="d-flex">
          <RangePicker
            format={"YYYY-MM-DD"}
            value={createdAts}
            onChange={(date, dateString) => {
              setCreatedAt(dateString);
              setCreatedAts(date);
            }}
            placeholder={["考试时间-开始", "考试时间-结束"]}
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={watchedAts}
            style={{ marginLeft: 10 }}
            onChange={(date, dateString) => {
              setWatchedAt(dateString);
              setWatchedAts(date);
            }}
            placeholder={["交卷时间-开始", "交卷时间-结束"]}
          />

          <Button className="ml-10" onClick={resetList}>
            清空
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => {
              resetLocalSearchParams({
                page: 1,
                watched_at: watched_at,
                created_at: created_at,
              });
              setRefresh(!refresh);
            }}
          >
            筛选
          </Button>
        </div>
      </div>
      <div className="float-left mb-30">
        <div className="d-flex stat-paper-box">
          <div className="flex-1 stat-item">
            <div className="name">总分</div>
            <div className="value">{total_score}分</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">及格分</div>
            <div className="value">{pass_score}分</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">最低分</div>
            <div className="value">{stat?.min}分</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">最高分</div>
            <div className="value">{stat?.max}分</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">平均分</div>
            <div className="value">{stat?.average}分</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">及格率</div>
            <div className="value">{stat?.pass_rate}%</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">及格人数</div>
            <div className="value">{stat?.pass_count}人</div>
          </div>
          <div className="flex-1 stat-item">
            <div className="name">总人数</div>
            <div className="value">{total}人</div>
          </div>
        </div>
      </div>
      <div className="float-left">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={paginationProps}
        />
      </div>
    </div>
  );
};
