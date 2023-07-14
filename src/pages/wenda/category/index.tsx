import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { wenda } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, PerButton } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
}

const WendaCategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "问答分类";
    dispatch(titleAction("问答分类"));
  }, []);

  useEffect(() => {
    getData();
  }, [refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    wenda
      .category()
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
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "排序",
      width: 120,
      render: (_, record: any) => <span>{record.sort}</span>,
    },
    {
      title: "分类名",
      dataIndex: "name",
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: "操作",
      width: 130,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.Wenda.category.update"
            onClick={() => {
              navigate("/wenda/question/category/update?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.Wenda.category.delete"
            onClick={() => {
              destory(record.id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const destory = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此分类？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        wenda
          .destroyCate(id)
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
      <BackBartment title="问答分类" />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="primary"
          text="新建问答分类"
          class=""
          icon={null}
          p="addons.Wenda.category.store"
          onClick={() => navigate("/wenda/question/category/create")}
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

export default WendaCategoriesPage;
