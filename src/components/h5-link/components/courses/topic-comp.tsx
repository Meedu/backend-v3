import { useEffect, useState } from "react";
import { Modal, message, Table, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { topic, system } from "../../../../api/index";

interface DataType {
  id: React.Key;
  charge: number;
}

interface PropsInterface {
  onChange: (result: any) => void;
}

export const TopicComp = (props: PropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [configUrl, setConfigUrl] = useState<string>("");

  useEffect(() => {
    getData();
    getUrl();
  }, [page, size, refresh]);

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

  const getUrl = () => {
    system.setting().then((res: any) => {
      let configData = res.data["系统"];
      for (let index in configData) {
        if (configData[index].key === "meedu.system.h5_url") {
          let h5Url = configData[index].value;
          setConfigUrl(h5Url);
        }
      }
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
    {
      title: "价格",
      width: 120,
      dataIndex: "charge",
      render: (charge: number) => <span>￥{charge}</span>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let row: any = selectedRows[0];
      if (row) {
        let url = encodeURIComponent(
          configUrl +
            "/addons/MeeduTopics/app-view/dist/index.html#/?id=" +
            row.id
        );
        let link = "/pages/webview/webview?url=" + url + "&title=" + row.title;
        props.onChange(link);
      }
    },
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
          style={{ width: 200, marginLeft: 345 }}
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
  );
};
