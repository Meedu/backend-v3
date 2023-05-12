import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { system } from "../../../../../api/index";
import { dateWholeFormat } from "../../../../../utils/index";

interface DataType {
  id: React.Key;
  name: string;
  ip: string;
  ua: string;
  created_at: string;
}

export const UploadImagesComp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    system
      .uploadImagesLog({ page: page, size: size })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetData = () => {
    setPage(1);
    setList([]);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 100,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "名称",
      dataIndex: "name",
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: "上传时间",
      width: 300,
      dataIndex: "created_at",
      render: (created_at: string) => (
        <span>{dateWholeFormat(created_at)}</span>
      ),
    },
    {
      title: "操作",
      width: 100,
      render: (_, record: any) => (
        <Button
          type="link"
          size="small"
          className="b-n-link c-primary"
          onClick={() => {
            openUrl(record.visit_url);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  const openUrl = (url: string) => {
    window.open(url);
  };

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey={(record) => record.id}
        pagination={paginationProps}
      />
    </>
  );
};
