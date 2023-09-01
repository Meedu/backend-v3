import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import closeIcon from "../../../assets/img/close.png";

interface DataType {
  id: React.Key;
}

interface PropsInterface {
  open: boolean;
  results: any;
  onCancel: () => void;
}

export const PaperDetailDialog = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  useEffect(() => {
    if (props.results) {
      setLoading(true);
      let params = [];
      for (let index in props.results) {
        let list = props.results[index];
        let obj = {
          id: index,
        };
        Object.assign(obj, list);
        params.push(obj);
      }
      setList(params);
      setLoading(false);
    }
  }, [props.results]);

  const columns: ColumnsType<DataType> = [
    {
      title: "试题ID",
      width: 150,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "关联试卷/模拟试卷/练习",
      render: (_, record: any) => (
        <>
          {record.papers.length > 0 &&
            record.papers.map((item: any) => (
              <p
                key={item.id}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                试卷-{item.title}
              </p>
            ))}
          {record.mock_papers.length > 0 &&
            record.mock_papers.map((item: any) => (
              <p
                key={item.id}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                模拟-{item.title}
              </p>
            ))}
          {record.practices.length > 0 &&
            record.practices.map((item: any) => (
              <p
                key={item.id}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                练习-{item.name}
              </p>
            ))}
        </>
      ),
    },
  ];

  return (
    <>
      {props.open && (
        <div className="paper-dialog-mask">
          <div className="paper-result-dialog-box">
            <div className="meedu-dialog-header">
              <span>成卷详情</span>
              <img
                className="icon-close"
                onClick={() => {
                  props.onCancel();
                }}
                src={closeIcon}
              />
            </div>
            <div className="meedu-dialog-body">
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
          </div>
        </div>
      )}
    </>
  );
};
