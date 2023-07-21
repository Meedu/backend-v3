import { useState, useEffect } from "react";
import { Table, Button, Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { live } from "../../../api/index";
import { useDispatch } from "react-redux";
import { dateFormat } from "../../../utils/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { DurationText, BackBartment } from "../../../components";
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  created_at: string;
}

const LiveVideoUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [mobile, setMobile] = useState("");
  const [nick_name, setNickName] = useState("");
  const [id, setId] = useState(Number(result.get("id")));
  const [cid, setCid] = useState(Number(result.get("course_id")));

  useEffect(() => {
    document.title = "直播课时学员";
    dispatch(titleAction("直播课时学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setCid(Number(result.get("course_id")));
  }, [result.get("id"), result.get("course_id")]);

  useEffect(() => {
    getData();
  }, [id, cid, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .videoWatchUsers(id, {
        course_id: cid,
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        mobile: mobile,
        nick_name: nick_name,
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
    setMobile("");
    setNickName("");
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
      title: "观看时长",
      width: 150,
      render: (_, record: any) => (
        <DurationText duration={record.duration}></DurationText>
      ),
    },
    {
      title: "总时长",
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
      course_id: cid,
      page: 1,
      size: total,
      sort: "id",
      order: "desc",
      mobile: mobile,
      nick_name: nick_name,
    };

    live.videoWatchUsers(id, params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename =
        "直播课时学员记录|" + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx";
      let sheetName = "sheet1";

      let data = [
        [
          "学员ID",
          "学员",
          "手机号",
          "观看时长",
          "总时长",
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
          durationTime(item.duration),
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
    <div className="meedu-main-body">
      <BackBartment title="直播课时学员" />
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex"></div>
        <div className="d-flex">
          <Input
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员手机号"
          />
          <Input
            value={nick_name}
            onChange={(e) => {
              setNickName(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="学员昵称"
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

export default LiveVideoUsersPage;
