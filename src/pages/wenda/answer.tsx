import { useState, useEffect } from "react";
import { Table, Modal, message, Tag, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { wenda } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, PerButton } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  user_id: number;
  vote_count: number;
  created_at: string;
}

const WendaAnswerPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [status, setStatus] = useState(Number(result.get("status")));

  useEffect(() => {
    document.title = "问题回答";
    dispatch(titleAction("问题回答"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setStatus(Number(result.get("status")));
    getData();
  }, [result.get("id"), result.get("status"), refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    wenda
      .answer(id)
      .then((res: any) => {
        setList(res.data.answers);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "学员ID",
      width: 120,
      dataIndex: "user_id",
      render: (user_id: number) => <span>{user_id}</span>,
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
      title: "点赞",
      width: 120,
      dataIndex: "vote_count",
      render: (vote_count: number) => <span>{vote_count}次</span>,
    },
    {
      title: "内容",
      width: 500,
      render: (_, record: any) => <div>{record.original_content}</div>,
    },
    {
      title: "答案",
      width: 120,
      render: (_, record: any) => (
        <>{record.is_correct === 1 && <Tag color="success">答案</Tag>}</>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      width: 160,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="评论"
            class="c-primary"
            icon={null}
            p="addons.Wenda.question.answers.comments"
            onClick={() => {
              navigate(
                "/wenda/question/comment?id=" +
                  record.question_id +
                  "&answer_id=" +
                  record.id
              );
            }}
            disabled={null}
          />
          {status !== 1 && (
            <PerButton
              type="link"
              text="设为答案"
              class="c-primary"
              icon={null}
              p="addons.Wenda.question.answers.setTrue"
              onClick={() => {
                setAnswer(record.id);
              }}
              disabled={null}
            />
          )}
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.Wenda.question.answers.delete"
            onClick={() => {
              destory(record.id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const destory = (aid: number) => {
    if (aid === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此回答？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        wenda
          .destoryAnswer(id, aid)
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

  const setAnswer = (aid: number) => {
    if (aid === 0) {
      return;
    }
    wenda.setAnswer(id, aid).then(() => {
      message.success("成功");
      navigate("/wenda/question/answer?id=" + id + "&status=1", {
        replace: true,
      });
      resetData();
    });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="问题回答" />
      <div className="float-left mt-30">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WendaAnswerPage;
