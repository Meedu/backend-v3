import { useEffect, useState } from "react";
import { Modal, message, Table, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { practice } from "../../../api/index";

interface DataType {
  id: React.Key;
  charge: number;
}

interface PropsInterface {
  selected: any;
  onChange: (result: any) => void;
}

export const PracticeComp = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .list({
        page: page,
        size: size,
        sort: "created_at",
        order: "desc",
        key: keywords,
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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setKeywords("");
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
      title: "练习ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "练习",
      render: (_, record: any) => <div>{record.name}</div>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let row: any = selectedRows;
      let newbox: any = [];
      if (row) {
        for (var i = 0; i < row.length; i++) {
          let item = {
            type: "practice",
            id: row[i].id,
            title: row[i].name,
            thumb: null,
            charge: row[i].charge,
          };
          newbox.push(item);
        }
        props.onChange(newbox);
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: props.selected.indexOf(record.id) !== -1, //禁用的条件
    }),
  };

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <Input
          value={keywords}
          onChange={(e) => {
            setKeywords(e.target.value);
          }}
          allowClear
          style={{ width: 150 }}
          placeholder="关键字"
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
      <div className="float-left mb-15">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
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
