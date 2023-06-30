import { useState, useEffect } from "react";
import { Table, Modal, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { path } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
}

const LearnPathStepPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [title, setTitle] = useState(String(result.get("title")));

  useEffect(() => {
    document.title = "学习步骤";
    dispatch(titleAction("学习步骤"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setTitle(String(result.get("title")));
  }, [result.get("id"), result.get("title")]);

  useEffect(() => {
    getData();
  }, [id, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    path
      .stepList({
        path_id: id,
      })
      .then((res: any) => {
        setList(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "排序",
      width: "7%",
      render: (_, record: any) => <span>{record.sort}</span>,
    },
    {
      title: "学习步骤",
      width: "15%",
      render: (_, record: any) => <span>{record.name}</span>,
    },
    {
      title: "课程数",
      width: "11%",
      render: (_, record: any) => <span>{record.courses_count}课程</span>,
    },
    {
      title: "步骤简介",
      width: "57%",
      render: (_, record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record.desc }}></div>
      ),
    },
    {
      title: "操作",
      width: "10%",
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.learnPaths.step.update"
            onClick={() => {
              navigate(
                "/learningpath/step/update?id=" + record.id + "&path_id=" + id
              );
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.learnPaths.step.delete"
            onClick={() => {
              destory(record.id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const resetData = () => {
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
      content: "确认删除此步骤？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        path
          .stepDestroy(id)
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
      <BackBartment title={title} />
      <div className="float-left  mt-30 mb-30">
        <PerButton
          type="primary"
          text="添加步骤"
          class=""
          icon={null}
          p="addons.learnPaths.step.store"
          onClick={() => navigate("/learningpath/step/create?path_id=" + id)}
          disabled={null}
        />
      </div>
      <div className="float-left">
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

export default LearnPathStepPage;
