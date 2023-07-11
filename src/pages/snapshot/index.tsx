import { useState, useEffect } from "react";
import { Table, Select, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { OptionSingleBar } from "../../components";
import { snapshot } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";

interface DataType {
  id: React.Key;
  other_id: number;
  user_id: number;
  type_text: string;
  last_snap_at: string;
}

const SnapshotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [type, setType] = useState([]);
  const [other_id, setOtherId] = useState("");
  const statusRows = [
    {
      value: "vod",
      label: "视频",
    },
    {
      value: "live",
      label: "直播课程",
    },
    {
      value: "book",
      label: "电子书",
    },
    {
      value: "paper",
      label: "考试",
    },
    {
      value: "practice",
      label: "练习",
    },
  ];

  useEffect(() => {
    document.title = "学习照片";
    dispatch(titleAction("学习照片"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    snapshot
      .list({
        page: page,
        size: size,
        user_id: user_id,
        type: type,
        other_id: other_id,
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
    setUserId("");
    setType([]);
    setOtherId("");
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
      width: 100,
      dataIndex: "user_id",
      render: (user_id: number) => <span>{user_id}</span>,
    },
    {
      title: "课程ID",
      width: 100,
      dataIndex: "other_id",
      render: (other_id: number) => <span>{other_id}</span>,
    },
    {
      title: "学员",
      width: 250,
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
      title: "课程名称",
      render: (_, record: any) => <span>{record.type_title}</span>,
    },
    {
      title: "照片",
      width: 100,
      render: (_, record: any) => <span>{record.count}</span>,
    },
    {
      title: "最后拍照时间",
      width: 200,
      dataIndex: "last_snap_at",
      render: (last_snap_at: string) => <span>{dateFormat(last_snap_at)}</span>,
    },
    {
      title: "操作",
      width: 80,
      render: (_, record: any) => (
        <Button
          type="link"
          className="c-primary"
          onClick={() => {
            if (!record.images) {
              message.warning("暂无照片");
              return;
            }
            navigate(
              "/snapshot/images?rid=" +
                record.id +
                "&other_id=" +
                record.other_id +
                "&user_id=" +
                record.user_id
            );
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div>
          <OptionSingleBar
            text="拍照设置"
            value="/system/config?key=随机拍照&referer=%2Fsnapshot%2Findex"
          ></OptionSingleBar>
        </div>
        <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
          />
          <Input
            value={other_id}
            onChange={(e) => {
              setOtherId(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="课程ID"
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

export default SnapshotPage;
