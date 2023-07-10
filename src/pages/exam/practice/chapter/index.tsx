import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { practice } from "../../../../api/index";
import { titleAction } from "../../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const PracticeChaptersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  useEffect(() => {
    document.title = "练习章节";
    dispatch(titleAction("练习章节"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .chapterList({
        pid: id,
      })
      .then((res: any) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetData = () => {
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "排序",
      width: 120,
      render: (_, record: any) => <span>{record.sort}</span>,
    },
    {
      title: "章节名",
      render: (_, record: any) => <span>{record.name}</span>,
    },
    {
      title: "题目数",
      width: 120,
      render: (_, record: any) => <span>{record.question_count}个</span>,
    },
    {
      title: "操作",
      width: 140,
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="章节组卷"
            class="c-primary"
            icon={null}
            p="addons.Paper.practice_chapter.questions"
            onClick={() => {
              navigate("/exam/practice/chapter/question/index?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.Paper.practice_chapter.update"
            onClick={() => {
              navigate(
                "/exam/practice/chapter/update?id=" + record.id + "&pid=" + id
              );
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的章节？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        practice
          .chaptersDestoryMulti({
            ids: selectedRowKeys,
          })
          .then(() => {
            message.success("成功");
            resetData();
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="练习章节" />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="primary"
          text="添加章节"
          class=""
          icon={null}
          p="addons.Paper.practice_chapter.store"
          onClick={() => navigate("/exam/practice/chapter/create?pid=" + id)}
          disabled={null}
        />
        <PerButton
          type="danger"
          text="批量删除"
          class="ml-10"
          icon={null}
          p="addons.Paper.practice_chapter.delete"
          onClick={() => destorymulti()}
          disabled={null}
        />
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
          pagination={false}
        />
      </div>
    </div>
  );
};

export default PracticeChaptersPage;
