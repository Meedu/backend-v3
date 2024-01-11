import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  message,
  Drawer,
  Input,
  Button,
  Tag,
  DatePicker,
  Space,
  Select,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { wenda } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import dayjs from "dayjs";

interface DataType {
  id: React.Key;
  user_id: number;
  title: string;
  view_times: number;
  vote_count: number;
  answer_count: number;
  credit1: number;
  created_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  keywords?: string;
  user_id?: string;
  category_id?: any;
  status?: number;
  created_at?: any;
}

const WendaPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    keywords: "",
    user_id: "",
    category_id: "[]",
    status: "-1",
    created_at: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const keywords = searchParams.get("keywords");
  const user_id = searchParams.get("user_id");
  const category_id = JSON.parse(searchParams.get("category_id") || "[]");
  const status = Number(searchParams.get("status") || "-1");
  const created_at = JSON.parse(searchParams.get("created_at") || "[]");
  const [createdAts, setCreatedAts] = useState<any>(
    created_at.length > 0
      ? [dayjs(created_at[0], "YYYY-MM-DD"), dayjs(created_at[1], "YYYY-MM-DD")]
      : []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const statusTypes = [
    {
      value: -1,
      label: "全部",
    },
    {
      value: 0,
      label: "未解决",
    },
    {
      value: 1,
      label: "已解决",
    },
  ];

  useEffect(() => {
    document.title = "站内问答";
    dispatch(titleAction("站内问答"));
    getParams();
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  useEffect(() => {
    if (
      (created_at && created_at.length > 0) ||
      (category_id && category_id.length !== 0) ||
      user_id ||
      keywords ||
      status !== -1
    ) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  }, [created_at, category_id, user_id, keywords, status]);

  const getData = () => {
    if (loading) {
      return;
    }
    let time = created_at;
    if (time.length > 0) {
      time[1] += " 23:59:59";
    }
    setLoading(true);
    wenda
      .list({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        user_id: user_id,
        category_id: category_id,
        status: status,
        created_at: time,
        keywords: keywords,
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

  const getParams = () => {
    wenda.category().then((res: any) => {
      let categories = res.data.data;
      const arr = [];
      for (let i = 0; i < categories.length; i++) {
        arr.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(arr);
    });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.keywords !== "undefined") {
          prev.set("keywords", params.keywords);
        }
        if (typeof params.user_id !== "undefined") {
          prev.set("user_id", params.user_id);
        }
        if (typeof params.category_id !== "undefined") {
          prev.set("category_id", JSON.stringify(params.category_id));
        }
        if (typeof params.status !== "undefined") {
          prev.set("status", params.status + "");
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
      keywords: "",
      user_id: "",
      category_id: [],
      status: -1,
      created_at: [],
    });
    setList([]);
    setSelectedRowKeys([]);
    setCreatedAts([]);
    setRefresh(!refresh);
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的优惠码？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        wenda
          .destroyMulti({
            ids: selectedRowKeys,
          })
          .then(() => {
            message.success("成功");
            resetList();
            setLoading(false);
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
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
      title: "分类",
      width: 200,
      render: (_, record: any) => <span>{record?.category?.name || "-"}</span>,
    },
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
      title: "标题",
      width: 500,
      dataIndex: "title",
      render: (title: string) => <span>{title}</span>,
    },
    {
      title: "浏览",
      width: 120,
      dataIndex: "view_times",
      render: (view_times: number) => <span>{view_times}次</span>,
    },
    {
      title: "答案",
      width: 120,
      dataIndex: "answer_count",
      render: (answer_count: number) => <span>{answer_count}个</span>,
    },
    {
      title: "积分",
      width: 120,
      dataIndex: "credit1",
      render: (credit1: number) => <span>{credit1}积分</span>,
    },
    {
      title: "状态",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.status === 1 && (
            <Tag color="success">{record.status_text}</Tag>
          )}
          {record.status !== 1 && (
            <Tag color="default">{record.status_text}</Tag>
          )}
        </>
      ),
    },
    {
      title: "创建时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="回答"
          class="c-primary"
          icon={null}
          p="addons.Wenda.question.answers"
          onClick={() => {
            navigate(
              "/wenda/question/answer?id=" +
                record.id +
                "&status=" +
                record.status
            );
          }}
          disabled={null}
        />
      ),
    },
  ];

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="问答分类"
            class=""
            icon={null}
            p="addons.Wenda.category.list"
            onClick={() => navigate("/wenda/question/category/index")}
            disabled={null}
          />
          <Button
            type="primary"
            className="ml-10"
            danger
            onClick={() => destorymulti()}
          >
            批量删除
          </Button>
          <OptionBar
            text="问答配置"
            value="/system/config?key=问答"
          ></OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords || ""}
            onChange={(e) => {
              resetLocalSearchParams({
                keywords: e.target.value,
              });
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="标题关键字"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={category_id}
            onChange={(e) => {
              resetLocalSearchParams({
                category_id: typeof e !== "undefined" ? e : [],
              });
            }}
            allowClear
            placeholder="分类"
            options={categories}
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
              });
              setRefresh(!refresh);
              setDrawer(false);
            }}
          >
            筛选
          </Button>
          <div
            className="drawerMore d-flex ml-10"
            onClick={() => setDrawer(true)}
          >
            {showStatus && (
              <>
                <img src={filterHIcon} />
                <span className="act">已选</span>
              </>
            )}
            {!showStatus && (
              <>
                <img src={filterIcon} />
                <span>更多</span>
              </>
            )}
          </div>
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
      {drawer ? (
        <Drawer
          title="更多筛选"
          onClose={() => setDrawer(false)}
          maskClosable={false}
          open={true}
          footer={
            <Space className="j-b-flex">
              <Button
                onClick={() => {
                  resetList();
                  setDrawer(false);
                }}
              >
                清空
              </Button>
              <Button
                onClick={() => {
                  resetLocalSearchParams({
                    page: 1,
                  });
                  setRefresh(!refresh);
                  setDrawer(false);
                }}
                type="primary"
              >
                筛选
              </Button>
            </Space>
          }
          width={360}
        >
          <div className="float-left">
            <Input
              value={keywords || ""}
              onChange={(e) => {
                resetLocalSearchParams({
                  keywords: e.target.value,
                });
              }}
              allowClear
              placeholder="关键字"
            />
            <Select
              style={{ marginTop: 20, width: "100%" }}
              value={category_id}
              onChange={(e) => {
                resetLocalSearchParams({
                  category_id: typeof e !== "undefined" ? e : [],
                });
              }}
              allowClear
              placeholder="分类"
              options={categories}
            />
            <Input
              value={user_id || ""}
              onChange={(e) => {
                resetLocalSearchParams({
                  user_id: e.target.value,
                });
              }}
              allowClear
              style={{ marginTop: 20 }}
              placeholder="学员ID"
            />
            <Select
              style={{ marginTop: 20, width: "100%" }}
              value={status}
              onChange={(e) => {
                resetLocalSearchParams({
                  status: typeof e !== "undefined" ? e : -1,
                });
              }}
              allowClear
              placeholder="状态"
              options={statusTypes}
            />
            <RangePicker
              format={"YYYY-MM-DD"}
              value={createdAts}
              style={{ marginTop: 20 }}
              onChange={(date, dateString) => {
                setCreatedAts(date);
                resetLocalSearchParams({
                  created_at: dateString,
                });
              }}
              placeholder={["日期-开始", "日期-结束"]}
            />
          </div>
        </Drawer>
      ) : null}
    </div>
  );
};

export default WendaPage;
