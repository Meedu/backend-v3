import { useState, useEffect } from "react";
import type { MenuProps } from "antd";
import { Table, Modal, message, Space, Dropdown, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { live } from "../../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { dateFormat } from "../../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { LiveVideoStatsDialog } from "../components/stats-dialog";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const LiveVideoPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(1000);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [title, setTitle] = useState(String(result.get("title")));
  const [currentId, setCurrentId] = useState(0);
  const [visiable, setVisiable] = useState<boolean>(false);

  useEffect(() => {
    document.title = title;
    dispatch(titleAction("直播排课"));
  }, [title]);

  useEffect(() => {
    setId(Number(result.get("id")));
    setTitle(String(result.get("title")));
  }, [result.get("id"), result.get("title")]);

  useEffect(() => {
    getData();
  }, [id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .videoList({
        page: page,
        size: size,
        course_id: id,
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
      title: "标题",
      width: "42%",
      render: (_, record: any) => (
        <>
          {record.chapter && (
            <>
              <span>{record.chapter.name}</span>
              <span className="mx-5">/</span>
            </>
          )}
          <span>{record.title}</span>
        </>
      ),
    },
    {
      title: "直播时间",
      width: "18%",
      dataIndex: "published_at",
      render: (published_at: string) => <span>{dateFormat(published_at)}</span>,
    },
    {
      title: "状态",
      width: "18%",
      render: (_, record: any) => (
        <>
          {record.status === 1 && (
            <span className="c-green">· {record.status_text}</span>
          )}
          {record.status === 2 && (
            <span className="c-gray">· {record.status_text}</span>
          )}
          {record.status === 0 && (
            <span className="c-yellow">· {record.status_text}</span>
          )}
        </>
      ),
    },
    {
      title: "操作",
      width: "12%",
      fixed: "right",
      align: "right",
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
                p="addons.Zhibo.course_video.update"
                onClick={() => {
                  navigate(
                    "/live/course/video/update?id=" +
                      record.id +
                      "&course_id=" +
                      id
                  );
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
                text="聊天"
                class="c-primary"
                icon={null}
                p="addons.Zhibo.chat.list"
                onClick={() => {
                  navigate(
                    "/live/course/video/chats?id=" +
                      record.id +
                      "&course_id=" +
                      id
                  );
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
                p="addons.Zhibo.course_video.delete"
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
              p="addons.Zhibo.course_video.stats"
              onClick={() => {
                navigate(
                  "/live/course/video/users?id=" +
                    record.id +
                    "&course_id=" +
                    id
                );
              }}
              disabled={null}
            />
            {record.status === 2 && (
              <PerButton
                type="link"
                text="统计"
                class="c-primary"
                icon={null}
                p="addons.Zhibo.course_video.stats"
                onClick={() => {
                  showStatsDialog(record.id);
                }}
                disabled={null}
              />
            )}
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

  const destory = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "警告",
      icon: <ExclamationCircleFilled />,
      content: "确认操作？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        live
          .videoDestory(id)
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

  const showStatsDialog = (id: number) => {
    setCurrentId(id);
    setVisiable(true);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title={title} />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="primary"
          text="新建排课"
          class=""
          icon={null}
          p="addons.Zhibo.course_video.store"
          onClick={() => navigate("/live/course/video/create?course_id=" + id)}
          disabled={null}
        />
        <PerButton
          type="primary"
          text="章节管理"
          class="ml-10"
          icon={null}
          p="addons.Zhibo.course_chapter.list"
          onClick={() => navigate("/live/course/chapter/index?id=" + id)}
          disabled={null}
        />
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
      <LiveVideoStatsDialog
        id={currentId}
        open={visiable}
        onCancel={() => {
          setCurrentId(0);
          setVisiable(false);
        }}
      ></LiveVideoStatsDialog>
    </div>
  );
};

export default LiveVideoPage;
