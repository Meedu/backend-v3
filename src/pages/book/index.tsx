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
import { book } from "../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, ThumbBar, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const BookPage = () => {
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
    document.title = "电子书";
    dispatch(titleAction("电子书"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    book
      .list({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        key: keywords,
        cid: category_id,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        let categories = res.data.categories;
        const box: any = [];
        for (let i = 0; i < categories.length; i++) {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          });
        }
        setCategories(box);
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
      title: "电子书",
      width: "27%",
      render: (_, record: any) => (
        <ThumbBar
          width={90}
          value={record.thumb}
          height={120}
          title={record.name}
          border={4}
        ></ThumbBar>
      ),
    },
    {
      title: "分类",
      width: "10%",
      render: (_, record: any) => (
        <>
          {record.category && <span>{record?.category?.name || '-'}</span>}
          {!record.category && <span className="c-red">数据不完整</span>}
        </>
      ),
    },
    {
      title: "价格",
      width: "7%",
      render: (_, record: any) => <span>{record.charge}元</span>,
    },
    {
      title: "销量",
      width: "7%",
      render: (_, record: any) => <span>{record.user_count}</span>,
    },
    {
      title: "阅读",
      width: "7%",
      render: (_, record: any) => <span>{record.view_times}次</span>,
    },
    {
      title: "上架时间",
      width: "14%",
      render: (_, record: any) => (
        <span>{dateFormat(record.published_at)}</span>
      ),
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
                p="addons.meedu_books.book.update"
                onClick={() => {
                  navigate("/meedubook/book/update?id=" + record.id);
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
                p="addons.meedu_books.book.delete"
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
              text="文章"
              class="c-primary"
              icon={null}
              p="addons.meedu_books.book_article.list"
              onClick={() => {
                navigate(
                  "/meedubook/article/index?bid=" +
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
              p="addons.meedu_books.book.users"
              onClick={() => {
                navigate("/meedubook/book/users?bid=" + record.id);
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
      content: "确认删除此电子书？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        book
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
            text="新建电子书"
            class=""
            icon={null}
            p="addons.meedu_books.book.store"
            onClick={() => navigate("/meedubook/book/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="电子书分类"
            class="ml-10"
            icon={null}
            p="addons.meedu_books.book_category.list"
            onClick={() => navigate("/meedubook/category/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="电子书评论"
            class="ml-10"
            icon={null}
            p="addons.meedu_books.book.comments.list"
            onClick={() => navigate("/meedubook/book/comment")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="文章评论"
            class="ml-10"
            icon={null}
            p="addons.meedu_books.book_article.comments.list"
            onClick={() => navigate("/meedubook/article/comment")}
            disabled={null}
          />
          <OptionBar
            text="电子书推荐"
            value="/system/bookConfig?referer=%2Fmeedubook%2Fbook%2Findex"
          ></OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="电子书关键字"
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

export default BookPage;
