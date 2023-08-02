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
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { path } from "../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, ThumbBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const LearnPathPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [category_id, setCategoryId] = useState([]);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    document.title = "学习路径";
    dispatch(titleAction("学习路径"));
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
    path
      .list({
        page: page,
        size: size,
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

  const getParams = () => {
    path.create().then((res: any) => {
      let categories = res.data.categories;
      const box: any = [];
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].children.length > 0) {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          });
          let children = categories[i].children;
          for (let j = 0; j < children.length; j++) {
            children[j].name = "|----" + children[j].name;
            box.push({
              label: children[j].name,
              value: children[j].id,
            });
          }
        } else {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          });
        }
      }
      setCategories(box);
    });
  };

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setKeywords("");
    setCategoryId([]);
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
      title: "ID",
      width: "6%",
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "学习路径",
      width: "22%",
      render: (_, record: any) => (
        <ThumbBar
          width={120}
          value={record.thumb}
          height={90}
          title={record.name}
          border={4}
        ></ThumbBar>
      ),
    },
    {
      title: "分类",
      width: "8%",
      render: (_, record: any) => <span>{record?.category?.name || '-'}</span>,
    },
    {
      title: "价格",
      width: "12%",
      render: (_, record: any) => (
        <>
          <div>现价：{record.charge}元</div>
          <div style={{ color: "#666" }} className="original-charge">
            原价：{record.original_charge}元
          </div>
        </>
      ),
    },
    {
      title: "包含步骤",
      width: "8%",
      render: (_, record: any) => <span>{record.steps_count}个步骤</span>,
    },
    {
      title: "包含课程",
      width: "8%",
      render: (_, record: any) => <span>{record.courses_count}个课程</span>,
    },
    {
      title: "上架时间",
      width: "14%",
      dataIndex: "published_at",
      render: (published_at: string) => <span>{dateFormat(published_at)}</span>,
    },
    {
      title: "是否显示",
      width: "8%",
      render: (_, record: any) => (
        <>
          {record.is_show === 1 && <span className="c-green">· 显示</span>}
          {record.is_show !== 1 && <span className="c-red">· 隐藏</span>}
        </>
      ),
    },
    {
      title: "操作",
      width: "14%",
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
                p="addons.learnPaths.path.update"
                onClick={() => {
                  navigate("/learningpath/path/update?id=" + record.id);
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
                p="addons.learnPaths.path.delete"
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
              text="步骤"
              class="c-primary"
              icon={null}
              p="addons.learnPaths.step.list"
              onClick={() => {
                navigate(
                  "/learningpath/step/index?id=" +
                    record.id +
                    "&title=" +
                    record.name
                );
              }}
              disabled={null}
            />
            <PerButton
              type="link"
              text="学员"
              class="c-primary"
              icon={null}
              p="addons.learnPaths.path.users"
              onClick={() => {
                navigate("/learningpath/path/user?id=" + record.id);
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
      content: "确认删除此学习路径？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        path
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
            text="新建学习路径"
            class=""
            icon={null}
            p="addons.learnPaths.path.store"
            onClick={() => navigate("/learningpath/path/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="学习路径分类"
            class="ml-10"
            icon={null}
            p="addons.learnPaths.category.list"
            onClick={() => navigate("/learningpath/path/category/index")}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="课程关键字"
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

export default LearnPathPage;
