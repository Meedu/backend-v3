import { useState, useEffect } from "react";
import { Row, Col, Table, Modal, message, Button, DatePicker, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { topic } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";
import { dateFormat } from "../../utils/index";
import {
  ExclamationCircleFilled,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import moment from "moment";
import dayjs from "dayjs";

interface DataType {
  id: React.Key;
  created_at: string;
  user_id: number;
  updated_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  created_at?: any;
}

const TopicCommentsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
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

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

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
    let time = [...created_at];
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    setLoading(true);
    topic
      .comments({
        page: page,
        size: size,
        user_id: user_id,
        topic_id: null,
        created_at: time,
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
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
    resetLocalSearchParams({
      page: 1,
      size: 10,
      created_at: [],
    });
    setList([]);
    setUserId("");
    setCreatedAt([]);
    setCreatedAts([]);
    setSelectedRowKeys([]);
    setFileList([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    resetLocalSearchParams({
      page: 1,
    });
    setList([]);
    setSelectedRowKeys([]);
    setFileList([]);
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let row: any = selectedRows;
      let newbox: any = [];
      if (row) {
        for (var i = 0; i < row.length; i++) {
          newbox.push({
            id: row[i].id,
            title: row[i].topic ? row[i].topic.title : "",
            content: row[i].content,
            status: 0,
          });
        }
        setFileList(newbox);
      }
      setSelectedRowKeys(selectedRowKeys);
    },
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

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中评论？",
      centered: true,
      okText: "确认删除",
      cancelText: "取消",
      onOk() {
        setVisible(true);
        setTimeout(() => {
          delSubmit();
        }, 1000);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const delSubmit = () => {
    delItem(fileList[0].id, 0);
  };

  const delItem = (id: number, index: number) => {
    topic
      .commentDestory(id)
      .then(() => {
        let box = [...fileList];
        box[index].status = 1;
        setFileList(box);
        if (index === fileList.length - 1) {
          return;
        }
        setTimeout(() => {
          delItem(box[index + 1].id, index + 1);
        }, 700);
      })
      .catch((e) => {
        let box = [...fileList];
        box[index].status = 2;
        setFileList(box);
        if (index === fileList.length - 1) {
          return;
        }
        setTimeout(() => {
          delItem(box[index + 1].id, index + 1);
        }, 700);
      });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="图文文章评论" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <Button type="primary" danger onClick={() => destorymulti()}>
            批量删除
          </Button>
        </div>
        <div className="d-flex">
          <RangePicker
            disabledDate={disabledDate}
            format={"YYYY-MM-DD"}
            value={createdAts}
            onChange={(date, dateString) => {
              setCreatedAts(date);
              setCreatedAt(dateString);
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
              resetLocalSearchParams({
                page: 1,
                created_at: created_at,
              });
              setRefresh(!refresh);
            }}
          >
            筛选
          </Button>
        </div>
      </div>
      <div className="float-left">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={paginationProps}
        />
      </div>
      <Modal
        footer={null}
        title="批量删除"
        open={visible}
        width={800}
        maskClosable={false}
        closable={false}
        centered
      >
        <Row gutter={[0, 10]}>
          <Col
            span={24}
            style={{
              marginTop: 30,
            }}
          >
            <Table
              pagination={false}
              rowKey="id"
              columns={[
                {
                  title: "图文",
                  width: 200,
                  render: (_, record: any) => <span>{record.title}</span>,
                },
                {
                  title: "评论内容",
                  width: 400,
                  ellipsis: true,
                  render: (_, record: any) => (
                    <div
                      dangerouslySetInnerHTML={{ __html: record.content }}
                    ></div>
                  ),
                },
                {
                  title: "进度",

                  render: (_, record: any) => (
                    <>
                      {record.status === 0 && (
                        <Tag icon={<SyncOutlined spin />} color="processing">
                          等待删除
                        </Tag>
                      )}
                      {record.status === 1 && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          删除成功
                        </Tag>
                      )}
                      {record.status === 2 && (
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          删除失败
                        </Tag>
                      )}
                    </>
                  ),
                },
              ]}
              dataSource={fileList}
            />
          </Col>
          <Col
            span={24}
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              marginTop: 30,
            }}
          >
            {fileList.every((item) => item.status > 0) && (
              <Button
                type="primary"
                onClick={() => {
                  setVisible(false);
                  resetData();
                }}
              >
                关闭
              </Button>
            )}
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default TopicCommentsPage;
