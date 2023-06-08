import { useState, useEffect } from "react";
import { Table, Modal, message, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { singlepage } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  url: string;
  title: string;
  view_times: number;
}

const SinglePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "单页面";
    dispatch(titleAction("单页面"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    singlepage
      .list({ page: page, size: size })
      .then((res: any) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "唯一标识",
      width: 150,
      render: (_, record: any) => <span>{record.sign}</span>,
    },
    {
      title: "标题",
      width: 280,
      dataIndex: "title",
      render: (title: string) => <span>{title}</span>,
    },
    {
      title: "地址",
      dataIndex: "url",
      render: (url: string) => <span>{url}</span>,
    },
    {
      title: "浏览次数",
      width: 150,
      dataIndex: "view_times",
      render: (view_times: number) => <span>{view_times}次</span>,
    },
    {
      title: "操作",
      width: 120,
      render: (_, record: any) => (
        <Space>
          <Button
            type="link"
            className="c-primary"
            onClick={() => {
              navigate("/singlepage/update?id=" + record.id);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            className="c-red"
            onClick={() => {
              destory(record.id);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const destory = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此页面？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        singlepage
          .destroy(id)
          .then(() => {
            setLoading(false);
            message.success("删除成功");
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

  return (
    <div className="meedu-main-body">
      <div className="float-left mb-30">
        <Button type="primary" onClick={() => navigate("/singlepage/create")}>
          添加
        </Button>
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

export default SinglePage;
