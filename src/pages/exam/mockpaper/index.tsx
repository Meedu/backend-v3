import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  message,
  Input,
  Button,
  Space,
  Dropdown,
  Select,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { mock } from "../../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  keywords?: string;
  category_id?: any;
}

const MockPaperPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "20",
    keywords: "",
    category_id: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "20");
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "");
  const [category_id, setCategoryId] = useState(
    JSON.parse(searchParams.get("category_id") || "[]")
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    document.title = "模拟试卷";
    dispatch(titleAction("模拟试卷"));
    getParams();
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    mock
      .list({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        keywords: keywords,
        category_id: category_id,
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.keywords !== "undefined") {
          prev.set("keywords", params.keywords);
        }
        if (typeof params.category_id !== "undefined") {
          prev.set("category_id", JSON.stringify(params.category_id));
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

  const getParams = () => {
    mock.create({}).then((res: any) => {
      let categories = res.data.categories;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        });
      }
      setCategories(box);
    });
  };

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 20,
      keywords: "",
      category_id: [],
    });
    setList([]);
    setCategoryId([]);
    setKeywords("");
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
      title: "分类",
      width: 200,
      render: (_, record: any) => <span>{record?.category?.name || "-"}</span>,
    },
    {
      title: "标题",
      width: 500,
      render: (_, record: any) => <span>{record.title}</span>,
    },
    {
      title: "及格",
      width: 150,
      render: (_, record: any) => (
        <span className="c-red">{record.pass_score}分</span>
      ),
    },
    {
      title: "时长",
      render: (_, record: any) => <span>{record.expired_minutes}m</span>,
    },
    {
      title: "操作",
      width: 140,
      fixed: "right",
      render: (_, record: any) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: (
              <PerButton
                type="link"
                text="编辑"
                class="c-primary"
                icon={null}
                p="addons.Paper.mock_paper.update"
                onClick={() => {
                  navigate("/exam/mockpaper/update?id=" + record.id);
                }}
                disabled={null}
              />
            ),
          },
          {
            key: "2",
            label: (
              <PerButton
                type="link"
                text="删除"
                class="c-red"
                icon={null}
                p="addons.Paper.mock_paper.delete"
                onClick={() => {
                  destory(record.id);
                }}
                disabled={null}
              />
            ),
          },
        ];
        return (
          <Space>
            <PerButton
              type="link"
              text="学员"
              class="c-primary"
              icon={null}
              p={[
                "addons.Paper.mock_paper.records",
                "addons.Paper.mock_paper.statistics",
                "addons.Paper.mock_paper.users",
              ]}
              onClick={() => {
                navigate("/exam/mockpaper/user?id=" + record.id);
              }}
              disabled={null}
            />
            <Dropdown menu={{ items }}>
              <Button
                type="link"
                className="c-primary"
                onClick={(e) => e.preventDefault()}
              >
                <Space size="small" align="center">
                  更多
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const resetData = () => {
    resetLocalSearchParams({
      page: 1,
    });
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
      content: "确认删除此模拟卷？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        mock
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

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建模拟卷"
            class=""
            icon={null}
            p="addons.Paper.mock_paper.store"
            onClick={() => navigate("/exam/mockpaper/create")}
            disabled={null}
          />
          <Button
            type="primary"
            className="ml-10"
            onClick={() => navigate("/exam/paper/category/index")}
          >
            分类管理
          </Button>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="模拟试卷关键字"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={category_id}
            onChange={(e) => {
              setCategoryId(e);
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
                keywords: keywords,
                category_id:
                  typeof category_id !== "undefined" ? category_id : [],
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

export default MockPaperPage;
