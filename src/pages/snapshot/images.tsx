import { useState, useEffect } from "react";
import { Table, Modal, Image, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { snapshot } from "../../api/index";
import { BackBartment, PerButton } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const SnapshotImagesPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [srcList, setSrcList] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [rid, setRid] = useState(Number(result.get("rid")));
  const [other_id, setOtherId] = useState(Number(result.get("other_id")));
  const [user_id, setUserId] = useState(Number(result.get("user_id")));

  useEffect(() => {
    document.title = "查看照片";
    dispatch(titleAction("查看照片"));
  }, []);

  useEffect(() => {
    setRid(Number(result.get("rid")));
    setOtherId(Number(result.get("other_id")));
    setUserId(Number(result.get("user_id")));
  }, [result.get("other_id"), result.get("user_id"), result.get("rid")]);

  useEffect(() => {
    getData();
  }, [other_id, user_id, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    snapshot
      .list({
        other_id: other_id,
        user_id: user_id,
      })
      .then((res: any) => {
        setList(res.data.data[0].images);
        setTotal(res.data.total);
        setLoading(false);
        showPreview(res.data.data[0].images);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const showPreview = (images: any) => {
    const arr: any = [];
    images.forEach((item: any) => {
      arr.push(item.thumb);
    });
    setSrcList(arr);
  };

  const resetList = () => {
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "拍照时间",
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      width: 250,
      render: (_, record: any) => (
        <Image src={record.thumb} width={100} height={100}></Image>
      ),
    },
  ];

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的图片？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        snapshot
          .destorymulti({
            ids: selectedRowKeys,
            rid: rid,
          })
          .then(() => {
            message.success("成功");
            resetList();
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="查看照片" />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="danger"
          text="批量删除"
          class=""
          icon={null}
          p="addons.Snapshot.images.delete"
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

export default SnapshotImagesPage;
