import { useState, useEffect } from "react";
import { Table, Modal, message } from "antd";
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

const WendaCommentPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [answer_id, setAnswerId] = useState(Number(result.get("answer_id")));

  useEffect(() => {
    document.title = "问题评论";
    dispatch(titleAction("问题评论"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setAnswerId(Number(result.get("answer_id")));
    getData();
  }, [result.get("id"), result.get("answer_id"), refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    wenda
      .comment(answer_id)
      .then((res: any) => {
        setList(res.data.comments);
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
      title: "内容",
      width: 500,
      render: (_, record: any) => <div>{record.original_content}</div>,
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      width: 100,
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.Wenda.question.answers.comments.delete"
          onClick={() => {
            destory(record.id);
          }}
          disabled={null}
        />
      ),
    },
  ];

  const destory = (cid: number) => {
    if (cid === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此评论？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        wenda
          .destoryComment(cid)
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
      <BackBartment title="问题评论" />
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

export default WendaCommentPage;
