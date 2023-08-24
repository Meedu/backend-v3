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
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { live } from "../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, ThumbBar, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const LivePage = () => {
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
  const [teacher_id, setTeacherId] = useState([]);
  const [status, setStatus] = useState(-1);
  const [teachers, setTeachers] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  useEffect(() => {
    document.title = "直播课";
    dispatch(titleAction("直播课"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  useEffect(() => {
    if (
      (category_id && category_id.length !== 0) ||
      (teacher_id && teacher_id.length !== 0) ||
      status !== -1 ||
      keywords
    ) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  }, [category_id, teacher_id, status, keywords]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .list({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        keywords: keywords,
        category_id: category_id,
        teacher_id: teacher_id,
        status: status,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
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
        let statusList = res.data.statusList;
        const box2: any = [];
        for (let i = 0; i < statusList.length; i++) {
          box2.push({
            label: statusList[i].name,
            value: statusList[i].key,
          });
        }
        setStatusList(box2);
        let teachers = res.data.teachers;
        const box3: any = [];
        for (let i = 0; i < teachers.length; i++) {
          box3.push({
            label: teachers[i].name,
            value: teachers[i].id,
          });
        }
        setTeachers(box3);
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
    setStatus(-1);
    setCategoryId([]);
    setTeacherId([]);
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
      title: "直播课程",
      width: "22%",
      render: (_, record: any) => (
        <ThumbBar
          width={120}
          value={record.thumb}
          height={90}
          title={record.title}
          border={4}
        ></ThumbBar>
      ),
    },
    {
      title: "分类",
      width: "8%",
      render: (_, record: any) => (
        <>
          {record.category && <span>{record?.category?.name || "-"}</span>}
          {!record.category && <span className="c-red">数据不完整</span>}
        </>
      ),
    },
    {
      title: "讲师/助教",
      width: "10%",
      render: (_, record: any) => (
        <>
          <span>{record.teacher.name}</span>
          {record.assistant && <span>/{record.assistant.name}</span>}
        </>
      ),
    },
    {
      title: "价格",
      width: "8%",
      render: (_, record: any) => <span>{record.charge}元</span>,
    },
    {
      title: "销量",
      width: "8%",
      render: (_, record: any) => <span>{record.join_user_times}</span>,
    },
    {
      title: "下一场直播时间",
      width: "16%",
      render: (_, record: any) => (
        <>
          {record.status === 2 && (
            <span className="c-gray">· {record.status_text}</span>
          )}
          {record.status !== 2 && (
            <>
              {record.next_video.length === 0 ? (
                <span>-</span>
              ) : (
                <span>{dateFormat(record.published_at)}</span>
              )}
            </>
          )}
        </>
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
                text="统计"
                class="c-primary"
                icon={null}
                p="addons.Zhibo.course.stats"
                onClick={() => {
                  navigate("/live/course/stat?id=" + record.id);
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
                text="编辑"
                class="c-primary"
                icon={null}
                p="addons.Zhibo.course.update"
                onClick={() => {
                  navigate("/live/course/update?id=" + record.id);
                }}
                disabled={null}
              />
            ),
          },
          {
            key: "3",
            label: (
              <PerButton
                type="link"
                text="删除"
                class="c-red"
                icon={null}
                p="addons.Zhibo.course.delete"
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
              text="排课"
              class="c-primary"
              icon={null}
              p="addons.Zhibo.course_video.list"
              onClick={() => {
                navigate(
                  "/live/course/video/index?id=" +
                    record.id +
                    "&title=" +
                    record.title
                );
              }}
              disabled={null}
            />
            <PerButton
              type="link"
              text="学员"
              class="c-primary"
              icon={null}
              p="addons.Zhibo.course.users"
              onClick={() => {
                navigate("/live/course/users/index?id=" + record.id);
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
      content: "确认删除此课程？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        live
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
            text="新建直播课"
            class=""
            icon={null}
            p="addons.Zhibo.course.store"
            onClick={() => navigate("/live/course/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="直播课分类"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.course_category.list"
            onClick={() => navigate("/live/course/category/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="讲师管理"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.teacher.list"
            onClick={() => navigate("/live/teacher/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="课程评论"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.course_comment"
            onClick={() => navigate("/live/course/comment")}
            disabled={null}
          />
          <OptionBar
            text="直播服务配置"
            value="/system/liveConfig?referer=%2Flive%2Fcourse%2Findex"
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
            placeholder="课程名称关键字"
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
                  setPage(1);
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
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
              }}
              allowClear
              placeholder="课程名称关键字"
            />
            <Select
              style={{ width: "100%", marginTop: 20 }}
              value={category_id}
              onChange={(e) => {
                setCategoryId(e);
              }}
              allowClear
              placeholder="分类"
              options={categories}
            />
            <Select
              style={{ width: "100%", marginTop: 20 }}
              value={teacher_id}
              onChange={(e) => {
                setTeacherId(e);
              }}
              allowClear
              placeholder="讲师"
              options={teachers}
            />
            <Select
              style={{ width: "100%", marginTop: 20 }}
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
              allowClear
              placeholder="状态"
              options={statusList}
            />
          </div>
        </Drawer>
      ) : null}
    </div>
  );
};

export default LivePage;
