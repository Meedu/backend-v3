import { useState, useEffect } from "react";
import { Table, message, Space, Tag, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { course } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment, OptionBar } from "../../../components";

interface DataType {
  id: React.Key;
  name: string;
}

const CourseTencentPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [hlsVideoIds, setHlsVideoIds] = useState<any>([]);
  const [keywords, setKeywords] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  useEffect(() => {
    document.title = "腾讯云加密";
    dispatch(titleAction("腾讯云加密"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    course
      .tencentHlsList({
        page: page,
        size: size,
        keywords: keywords,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setHlsVideoIds(res.data.hlsVideoIds);
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 150,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "视频",
      render: (_, record: any) => <span>{record.title} </span>,
    },
    {
      title: "FileId",
      width: 320,
      render: (_, record: any) => <span>{record.aliyun_video_id}</span>,
    },
    {
      title: "状态",
      width: 200,
      render: (_, record: any) => (
        <>
          {typeof hlsVideoIds[record.id] === "undefined" ? (
            <Tag color="error">未提交</Tag>
          ) : (
            <Tag color="success">已提交</Tag>
          )}
        </>
      ),
    },
  ];

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setSelectedRowKeys([]);
    setKeywords("");
    setRefresh(!refresh);
  };

  const resetData = () => {
    setPage(1);
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const submit = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    course
      .tencentHlsSubmit({ ids: selectedRowKeys })
      .then(() => {
        setLoading(false);
        message.success("成功");
        resetData();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="腾讯云加密" />
      <div className="float-left j-b-flex  mt-30 mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="提交加密转码"
            class=""
            icon={null}
            p="addons.TencentCloudHls.videos.submitTransTask"
            onClick={() => submit()}
            disabled={null}
          />
          <OptionBar
            text="腾讯云HLS加密"
            value="/system/videoHlsConfig?referer=%2Fcourse%2Fvod%2Fvideo%2Fhls%2Ftencent"
          ></OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="视频名关键字"
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
      </div>
      <div className="float-left">
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

export default CourseTencentPage;
