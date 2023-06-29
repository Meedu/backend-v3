import { useState, useEffect } from "react";
import { Table, Modal, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { book } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { CourseCategoryCreateDialog } from "../components/category-create";
import { CourseCategoryUpdateDialog } from "../components/category-update";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
}

const BookCategoryPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [showAddWin, setShowAddWin] = useState<boolean>(false);
  const [showUpdateWin, setShowUpdateWin] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(0);

  useEffect(() => {
    document.title = "电子书分类管理";
    dispatch(titleAction("电子书分类管理"));
  }, []);

  useEffect(() => {
    getData();
  }, [refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    book
      .categoryList({})
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
      width: 150,
      render: (_, record: any) => <span>{record.sort}</span>,
    },
    {
      title: "分类名",
      render: (_, record: any) => <span>{record.name} </span>,
    },
    {
      title: "操作",
      width: 160,
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.meedu_books.book_category.update"
            onClick={() => {
              setUpdateId(record.id);
              setShowUpdateWin(true);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.meedu_books.book_category.delete"
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
      content: "确认删除此分类？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        book
          .categoryDestroy(id)
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
      <BackBartment title="电子书分类管理" />
      <CourseCategoryCreateDialog
        open={showAddWin}
        onCancel={() => setShowAddWin(false)}
        onSuccess={() => {
          resetData();
          setShowAddWin(false);
        }}
      ></CourseCategoryCreateDialog>
      <CourseCategoryUpdateDialog
        id={updateId}
        open={showUpdateWin}
        onCancel={() => setShowUpdateWin(false)}
        onSuccess={() => {
          resetData();
          setShowUpdateWin(false);
        }}
      ></CourseCategoryUpdateDialog>
      <div className="float-left  mt-30 mb-30">
        <PerButton
          type="primary"
          text="添加分类"
          class=""
          icon={null}
          p="addons.meedu_books.book_category.store"
          onClick={() => setShowAddWin(true)}
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

export default BookCategoryPage;
