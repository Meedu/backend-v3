import { useEffect, useState } from "react";
import { Modal, message, Table, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { ColumnsType } from "antd/es/table";
import { topic } from "../../api/index";

interface DataType {
  id: React.Key;
  title: string;
}

interface PropsInterface {
  open: boolean;
  selected: any;
  onSelected: (result: any) => void;
  onCancel: () => void;
}

export const SelectTopicMulti = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<any>([]);

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
    topic
      .list({
        page: page,
        size: size,
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
      title: "图文ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "图文",
      render: (_, record: any) => (
        <div className="d-flex">
          <div>
            <img src={record.thumb} width="80" height="60" />
          </div>
          <div className="ml-15">{record.title}</div>
        </div>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let row: any = selectedRows;
      let newbox: any = [];
      if (row) {
        for (var i = 0; i < row.length; i++) {
          newbox.push(row[i].id);
        }
        setSelectedKey(newbox);
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: props.selected.indexOf(record.id) !== -1, //禁用的条件
    }),
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="选择图文"
          closable={false}
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={900}
          maskClosable={false}
          onOk={() => {
            if (!selectedKey || selectedKey.length === 0) {
              message.error("请先选择内容");
              return;
            }
            props.onSelected(selectedKey);
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
        </Modal>
      ) : null}
    </>
  );
};
