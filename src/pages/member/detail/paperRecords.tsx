import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { member } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { DurationText } from "../../../components";

interface PropsInterface {
  id: number;
}

interface DataType {
  id: React.Key;
  created_at: string;
}

export const UserPaperRecordsComp = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [papers, setPapers] = useState<any>({});

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .userPapersRecords(props.id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setPapers(res.data.papers);
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
      title: "试卷编号",
      width: 200,
      render: (_, record: any) => <span>{record.paper_id}</span>,
    },
    {
      title: "标题",
      render: (_, record: any) => (
        <>
          {papers[record.paper_id] ? (
            <div>{papers[record.paper_id].title}</div>
          ) : (
            <span className="c-red">已删除</span>
          )}
        </>
      ),
    },
    {
      title: "得分",
      width: 150,
      render: (_, record: any) => (
        <>{record.status === 2 && <span>{record.score}分</span>}</>
      ),
    },
    {
      title: "用时",
      render: (_, record: any) => (
        <>
          {record.status === 2 && (
            <DurationText duration={record.used_seconds}></DurationText>
          )}
        </>
      ),
    },
    {
      title: "状态",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.status === 2 && <Tag color="success">已结束</Tag>}
          {record.status === 0 && <Tag color="default">未开始</Tag>}
          {record.status === 3 && <Tag color="warning">阅卷中</Tag>}
          {record.status === 1 && <Tag color="processing">考试中</Tag>}
        </>
      ),
    },
    {
      title: "开始时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "交卷时间",
      width: 200,
      dataIndex: "submit_at",
      render: (submit_at: string) => <span>{dateFormat(submit_at)}</span>,
    },
  ];

  return (
    <div className="float-left">
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey={(record) => record.id}
        pagination={paginationProps}
      />
    </div>
  );
};
