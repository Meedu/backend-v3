import { useState, useEffect } from "react";
import { Table, Button, DatePicker, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { live } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { DurationText } from "../../../components";
const { RangePicker } = DatePicker;
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  created_at: string;
}

const LiveWatchUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [is_watched, setIsWatched] = useState<any>([]);
  const [watched_at, setWatchedAt] = useState<any>([]);
  const [watchedAts, setWatchedAts] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));
  const statusMapRows = [
    {
      label: "未看完",
      value: 0,
    },
    {
      label: "已看完",
      value: 1,
    },
  ];

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .watchUsers(id, {
        page: page,
        size: size,
        is_watched: is_watched.length === 0 ? -1 : is_watched,
        watched_at: watched_at,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setIsWatched([]);
    setWatchedAts([]);
    setWatchedAt([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    setPage(1);
    setList([]);
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
    setPage(page);
    setSize(pageSize);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员ID",
      width: 120,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "学员",
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.nick_name}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: "观看进度",
      width: 150,
      render: (_, record: any) => <span>{record.progress}%</span>,
    },
    {
      title: "学习总时长",
      width: 150,
      render: (_, record: any) => (
        <DurationText duration={record.total_duration}></DurationText>
      ),
    },
    {
      title: "看完",
      width: 80,
      render: (_, record: any) => (
        <>
          {record.is_watched === 1 && <span className="c-green">是</span>}
          {record.is_watched !== 1 && <span>否</span>}
        </>
      ),
    },
    {
      title: "开始时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "看完时间",
      width: 200,
      dataIndex: "watched_at",
      render: (watched_at: string) => <span>{dateFormat(watched_at)}</span>,
    },
  ];

  const durationTime = (duration: number) => {
    let hour: any = Math.floor(duration / 3600);
    let minute: any = Math.floor((duration - hour * 3600) / 60);
    let second: any = duration - hour * 3600 - minute * 60;
    if (hour === 0 && minute === 0 && second === 0) {
      return null;
    }
    if (hour === 0) {
      hour = "";
    } else {
      hour = hour + ":";
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    return hour + minute + ":" + second;
  };

  const exportexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      is_watched: is_watched.length === 0 ? -1 : is_watched,
      watched_at: watched_at,
    };

    live.watchUsers(id, params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename =
        "直播课程观看学员|" + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx";
      let sheetName = "sheet1";

      let data = [
        [
          "学员ID",
          "学员",
          "手机号",
          "观看进度",
          "学习总时长",
          "看完",
          "开始时间",
          "看完时间",
        ],
      ];
      res.data.data.forEach((item: any) => {
        data.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          item.progress + "%",
          durationTime(item.total_duration),
          item.is_watched === 1 ? "是" : "否",
          item.created_at
            ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
            : "",
          item.watched_at
            ? moment(item.watched_at).format("YYYY-MM-DD HH:mm")
            : "",
        ]);
      });

      const jsonWorkSheet = XLSX.utils.json_to_sheet(data);
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
        <div className="d-flex"></div>
        <div className="d-flex">
          <Select
            style={{ width: 150 }}
            value={is_watched}
            onChange={(e) => {
              setIsWatched(e);
            }}
            allowClear
            placeholder="看完"
            options={statusMapRows}
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={watchedAts}
            style={{ marginLeft: 10 }}
            onChange={(date, dateString) => {
              dateString[1] += " 23:59:59";
              setWatchedAt(dateString);
              setWatchedAts(date);
            }}
            placeholder={["看完时间-开始", "看完时间-结束"]}
          />
          <Button className="ml-10" onClick={resetList}>
            清空
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => {
              setPage(1);
              setRefresh(!refresh);
            }}
          >
            筛选
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => exportexcel()}
          >
            导出表格
          </Button>
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

export default LiveWatchUsersPage;
