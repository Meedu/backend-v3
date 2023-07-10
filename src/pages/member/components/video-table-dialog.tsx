import { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { member } from "../../../api/index";
import { DurationText } from "../../../components";
import { dateFormat } from "../../../utils";

interface PropsInterface {
  open: boolean;
  text: string;
  id: number;
  userId: number;
  onCancel: () => void;
}

interface DataType {
  id: React.Key;
  created_at: string;
}

export const VideoTableDialog = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    if (props.id === 0) {
      return;
    }
    if (props.open && props.userId && props.id) {
      getData();
    }
  }, [props.open, props.userId, props.id]);

  const columns: ColumnsType<DataType> = [
    {
      title: "课时名称",
      width: "32%",
      render: (_, record: any) => <span>{record.title}</span>,
    },
    {
      title: "课时时长",
      width: "13%",
      render: (_, record: any) => (
        <DurationText duration={record.duration}></DurationText>
      ),
    },
    {
      title: "已学时长",
      width: "13%",
      render: (_, record: any) => (
        <>
          {typeof record.watch_record["watch_seconds"] !== "undefined" ? (
            <DurationText
              duration={record.watch_record.watch_seconds}
            ></DurationText>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "是否学完",
      width: "10%",
      render: (_, record: any) => (
        <>
          {typeof record.watch_record["watched_at"] !== "undefined" &&
          record.watch_record.watched_at ? (
            <span className="c-green">已学完</span>
          ) : (
            <span>未学完</span>
          )}
        </>
      ),
    },
    {
      title: "开始学习时间",
      width: "16%",
      render: (_, record: any) => (
        <>
          {typeof record.watch_record["created_at"] !== "undefined" &&
          record.watch_record.created_at ? (
            <span>{dateFormat(record.watch_record.created_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "最近一次学习",
      width: "16%",
      render: (_, record: any) => (
        <>
          {typeof record.watch_record["updated_at"] !== "undefined" &&
          record.watch_record.updated_at ? (
            <span>{dateFormat(record.watch_record.updated_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
  ];

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .userVideoWatchRecords({
        course_id: props.id,
        user_id: props.userId,
      })
      .then((res: any) => {
        let videos = res.data.videos;
        let list = [];
        for (let i in videos) {
          list.push(videos[i]);
        }
        setList(list);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <>
      {props.open && (
        <Modal
          title={props.text}
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={1000}
          maskClosable={false}
          footer={null}
          centered
        >
          <div style={{ minHeight: 400 }} className="mt-30">
            <Table
              loading={loading}
              columns={columns}
              dataSource={list}
              rowKey={(record) => record.id}
              pagination={false}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
