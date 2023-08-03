import { useEffect, useState } from "react";
import { Modal, Table, Image, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { snapshot } from "../../api/index";
import { PerButton } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateFormat } from "../../utils";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

interface PropsInterface {
  open: boolean;
  vid: number;
  uid: number;
  onCancel: () => void;
}

export const SnapshotDialog = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<any>([]);
  const [rid, setRid] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  useEffect(() => {
    setImages([]);
    if (props.open && props.vid !== 0 && props.uid !== 0) {
      getData();
    }
  }, [props.open, props.vid, props.uid]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let arr = [];
    arr.push(props.vid);
    snapshot
      .list({
        type: "vod",
        other_ids: arr,
        user_id: props.uid,
      })
      .then((res: any) => {
        setRid(res.data[props.vid].id);
        setImages(res.data[props.vid].images);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
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
        <Image
          src={record.thumb}
          width={100}
          height={100}
          preview={true}
        ></Image>
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
            setImages([]);
            getData();
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
    <>
      {props.open ? (
        <Modal
          title="学习照片"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={1000}
          maskClosable={false}
          footer={null}
          centered
        >
          <div
            className="mt-20"
            style={{
              maxHeight: 520,
              overflowX: "hidden",
              overflowY: "auto",
              marginBottom: 10,
            }}
          >
            <div className="float-left mb-30">
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
            <div className="float-left ">
              <Table
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                loading={loading}
                columns={columns}
                dataSource={images}
                rowKey={(record) => record.id}
                pagination={false}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
