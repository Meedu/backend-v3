import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { member } from "../../../api/index";
import { dateFormat } from "../../../utils/index";

interface PropsInterface {
  id: number;
}

interface DataType {
  id: React.Key;
  created_at: string;
}

export const UserInviteComp = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .userInviteRecords(props.id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
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
      title: "邀请学员ID",
      width: 200,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "邀请学员",
      render: (_, record: any) => (
        <>
          <div className="user-item d-flex">
            <div className="avatar">
              <img src={record.avatar} width="40" height="40" />
            </div>
            <div className="ml-10">{record.nick_name}</div>
          </div>
        </>
      ),
    },
    {
      title: "手机号码",
      width: 400,
      render: (_, record: any) => <span>{record.mobile}</span>,
    },
    {
      title: "注册时间",
      width: 215,
      render: (_, record: any) => <span>{dateFormat(record.created_at)}</span>,
    },
    {
      title: "邀请关系有效期至",
      width: 215,
      render: (_, record: any) => (
        <span>{dateFormat(record.invite_user_expired_at)}</span>
      ),
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
