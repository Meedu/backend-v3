import { useState, useEffect } from "react";
import { Table, Modal, message, Button, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { topic } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import moment from "moment";

interface DataType {
  id: React.Key;
  created_at: string;
  user_id: number;
  updated_at: string;
}

const TopicCommentsPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [created_at, setCreatedAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);

  useEffect(() => {
    document.title = "图文文章评论";
    dispatch(titleAction("图文文章评论"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    topic
      .comments({
        page: page,
        size: size,
        user_id: user_id,
        topic_id: null,
        created_at: created_at,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const del = (id: number) => {
    if (id === 0) {
      return;
    }

    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的评论？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        topic
          .commentDestory(id)
          .then(() => {
            setLoading(false);
            message.success("成功");
            resetData();
          })
          .catch((e) => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setUserId("");
    setCreatedAts([]);
    setCreatedAt([]);
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
      title: "学员",
      width: 300,
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
      title: "图文",
      width: 400,
      render: (_, record: any) => (
        <>{record.topic && <span>{record.topic.title}</span>}</>
      ),
    },
    {
      title: "评论内容",
      render: (_, record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record.content }}></div>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "updated_at",
      render: (updated_at: string) => <span>{dateFormat(updated_at)}</span>,
    },
    {
      title: "操作",
      width: 80,
      fixed: "right",
      render: (_, record: any) => (
        <Button
          type="link"
          className="c-red"
          onClick={() => {
            del(record.id);
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, "days"); // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="图文文章评论" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex"></div>
        <div className="d-flex">
          <RangePicker
            disabledDate={disabledDate}
            format={"YYYY-MM-DD"}
            value={createdAts}
            onChange={(date, dateString) => {
              dateString[1] += " 23:59:59";
              setCreatedAt(dateString);
              setCreatedAts(date);
            }}
            placeholder={["评论时间-开始", "评论时间-结束"]}
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

export default TopicCommentsPage;
