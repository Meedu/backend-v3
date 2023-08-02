import { useState, useEffect } from "react";
import { Table, Modal, Space, message, Button, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { certificate } from "../../api/index";
import { PerButton, BackBartment, UserImportDialog } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat, getToken, checkUrl } from "../../utils/index";
import config from "../../js/config";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

const CertificateUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [importDialog, setImportDialog] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "证书授予学员";
    dispatch(titleAction("证书授予学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [page, size, id, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    certificate
      .userList(id, {
        page: page,
        size: size,
        user_id: user_id,
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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setSelectedRowKeys([]);
    setUserId("");
    setRefresh(!refresh);
  };

  const delUser = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要删除的学员");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除授予选中的学员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        certificate
          .userDelete(id, { user_ids: selectedRowKeys })
          .then(() => {
            setLoading(false);
            message.success("成功");
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

  const resetData = () => {
    setPage(1);
    setList([]);
    setSelectedRowKeys([]);
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员ID",
      width: 150,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "学员",
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
      title: "手机号",
      width: 150,
      render: (_, record: any) => <span>{record.user?.mobile}</span>,
    },
    {
      title: "证书编号",
      width: 400,
      render: (_, record: any) => <span>{record.cert_no}</span>,
    },
    {
      title: "使用时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      width: 100,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="下载"
            class="c-primary"
            icon={null}
            p="addons.cert.download"
            onClick={() => {
              download(record.user_id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const download = (uid: number) => {
    window.open(
      checkUrl(config.url) +
        "backend/addons/Cert/cert/" +
        id +
        "/" +
        uid +
        "/download?token=" +
        getToken()
    );
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="证书授予学员" />
      <UserImportDialog
        open={importDialog}
        id={id}
        type="cert"
        name="证书授予批量导入模板"
        onCancel={() => setImportDialog(false)}
        onSuccess={() => {
          setImportDialog(false);
          resetData();
        }}
      ></UserImportDialog>
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="批量授予"
            class=""
            icon={null}
            p="addons.cert.user.import"
            onClick={() => setImportDialog(true)}
            disabled={null}
          />

          <PerButton
            type="danger"
            text="撤销授予"
            class="ml-10"
            icon={null}
            p="addons.cert.user.destroy"
            onClick={() => delUser()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
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
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.user_id}
          pagination={paginationProps}
        />
      </div>
    </div>
  );
};

export default CertificateUsersPage;
