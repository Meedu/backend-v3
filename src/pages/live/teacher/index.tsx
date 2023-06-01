import { useState, useEffect } from "react";
import { Table, Modal, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { live } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import { CourseTeacherCreateDialog } from "../components/teacher-create";
import { CourseTeacherUpdateDialog } from "../components/teacher-update";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
}

const LiveTeacherPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [showAddWin, setShowAddWin] = useState<boolean>(false);
  const [showUpdateWin, setShowUpdateWin] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(0);

  useEffect(() => {
    document.title = "讲师/助教管理";
    dispatch(titleAction("讲师/助教管理"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .teacherList({
        page: page,
        size: size,
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
      title: "讲师/助教ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "讲师/助教",
      width: 300,
      render: (_, record: any) => (
        <>
          <div className="user-item d-flex">
            <div className="avatar">
              <img src={record.avatar} width="40" height="40" />
            </div>
            <div className="ml-10">{record.name}</div>
          </div>
        </>
      ),
    },
    {
      title: "角色",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.role_id > 0 && (
            <span className="c-green">{record.role_name}</span>
          )}
          {record.role_id === 0 && (
            <span className="c-yellow">{record.role_name}</span>
          )}
        </>
      ),
    },
    {
      title: "课程",
      width: 150,
      render: (_, record: any) => <span>{record.courses_count}个</span>,
    },
    {
      title: "账号",
      render: (_, record: any) => <span>{record.username}</span>,
    },
    {
      title: "密码",
      render: (_, record: any) => (
        <div className="d-flex">
          <div>
            {record.id === currentId ? (
              <span>{record.password}</span>
            ) : (
              <span>∗∗∗∗∗∗</span>
            )}
          </div>
          <div className="ml-10">
            <EyeOutlined
              className="eyes-link"
              onClick={() => {
                if (currentId === record.id) {
                  setCurrentId(0);
                } else {
                  setCurrentId(record.id);
                }
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "操作",
      width: 120,
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.Zhibo.teacher.update"
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
            p="addons.Zhibo.teacher.delete"
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
      content: "确认删除此讲师/助教？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        live
          .teacherDestroy(id)
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
      <BackBartment title="讲师/助教管理" />
      <CourseTeacherCreateDialog
        open={showAddWin}
        onCancel={() => setShowAddWin(false)}
        onSuccess={() => {
          resetData();
          setShowAddWin(false);
        }}
      ></CourseTeacherCreateDialog>
      <CourseTeacherUpdateDialog
        id={updateId}
        open={showUpdateWin}
        onCancel={() => setShowUpdateWin(false)}
        onSuccess={() => {
          resetData();
          setShowUpdateWin(false);
        }}
      ></CourseTeacherUpdateDialog>
      <div className="float-left  mt-30 mb-30">
        <PerButton
          type="primary"
          text="添加讲师/助教"
          class=""
          icon={null}
          p="addons.Zhibo.teacher.store"
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
          pagination={paginationProps}
        />
      </div>
    </div>
  );
};

export default LiveTeacherPage;
