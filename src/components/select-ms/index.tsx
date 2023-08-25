import { useEffect, useState } from "react";
import { Modal, message, Table, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { miaosha } from "../../api/index";
import { ThumbBar } from "../../components";

interface DataType {
  id: React.Key;
  charge: number;
}

interface PropsInterface {
  open: boolean;
  onChange: (result: any) => void;
  onCancel: () => void;
}

export const SelectMiaosha = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<any>(null);

  useEffect(() => {
    if (props.open) {
      getData();
    }
  }, [props.open, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    miaosha
      .list({
        page: 1,
        size: 10,
        sort: "created_at",
        order: "desc",
        keywords: keywords,
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
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "秒杀课程",
      render: (_, record: any) => (
        <>
          {record.goods_type === "book" ? (
            <ThumbBar
              width={90}
              value={record.goods_thumb}
              height={120}
              title={record.goods_title}
              border={0}
            ></ThumbBar>
          ) : (
            <ThumbBar
              width={120}
              value={record.goods_thumb}
              height={90}
              title={record.goods_title}
              border={0}
            ></ThumbBar>
          )}
        </>
      ),
    },
    {
      title: "秒杀价",
      width: 120,
      dataIndex: "charge",
      render: (charge: number) => <span>￥{charge}</span>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let row: any = selectedRows[0];
      if (row) {
        setSelectedKey(row);
      }
    },
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="选择秒杀课程"
          closable={false}
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={900}
          maskClosable={false}
          onOk={() => {
            if (!selectedKey) {
              message.error("请选择秒杀课程");
              return;
            }
            props.onChange(selectedKey);
          }}
          centered
        >
          <div
            className="float-left mt-20"
            style={{
              maxHeight: 520,
              overflowX: "hidden",
              overflowY: "auto",
              marginBottom: 10,
            }}
          >
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
                  type: "radio",
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
        </Modal>
      ) : null}
    </>
  );
};
