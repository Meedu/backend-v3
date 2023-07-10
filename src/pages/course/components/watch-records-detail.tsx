import { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { course } from "../../../api/index";
import { DurationText } from "../../../components";

interface DataType {
  id: React.Key;
  duration: number;
  video_title: string;
}

interface PropsInterface {
  open: boolean;
  cid: number;
  uid: number;
  onCancel: () => void;
}

export const WatchRecordsDetailDialog = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    if (props.open && props.cid !== 0 && props.uid !== 0) {
      getData();
    }
  }, [props.open, props.cid, props.uid]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    course
      .recordsDetail(props.cid, props.uid, {})
      .then((res: any) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "标题",
      render: (_, record: any) => <span>{record.video_title}</span>,
    },
    {
      title: "进度",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.watch_seconds > 0 && (
            <DurationText duration={record.watch_seconds}></DurationText>
          )}
          {record.watch_seconds <= 0 && <span>0:00</span>}/
          <DurationText duration={record.duration}></DurationText>
        </>
      ),
    },
    {
      title: "状态",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.watch_seconds >= record.duration ? (
            <span className="c-green">已学完</span>
          ) : (
            <span>未学完</span>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      {props.open && (
        <Modal
          title="学习进度"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={1000}
          maskClosable={false}
          footer={null}
          centered
        >
          <div className="mt-30">
            <Table
              loading={loading}
              columns={columns}
              dataSource={list}
              rowKey={(record) => record.video_title + Math.random()}
              pagination={false}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
