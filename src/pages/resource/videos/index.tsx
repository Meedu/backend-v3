import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { media } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import {
  PerButton,
  ThumbBar,
  DurationText,
  UploadVideoItem,
} from "../../../components";
import { dateFormat } from "../../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  duration: number;
  goods_type_text: string;
  created_at: string;
}

const ResourceVideosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedLocalKeys, setSelectedLocalKeys] = useState<any>([]);
  const [selectedOtherKeys, setSelectedOtherKeys] = useState<any>([]);
  const [openUploadItem, setOpenUploadItem] = useState(false);
  const [isNoService, setIsNoService] = useState(false);
  const [isLocalService, setIsLocalService] = useState(false);
  const [isTenService, setIsTenService] = useState(false);
  const [isAliService, setIsAliService] = useState(false);
  const [records, setRecords] = useState<any>({});
  const [tenRecords, setTenRecords] = useState<any>({});
  const service = useSelector(
    (state: any) => state.systemConfig.value.video.default_service
  );
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    document.title = "视频库";
    dispatch(titleAction("视频库"));
  }, []);

  useEffect(() => {
    if (service === "") {
      setIsNoService(true);
    } else if (service === "local") {
      setIsLocalService(true);
    } else if (service === "tencent") {
      setIsTenService(true);
    } else if (service === "aliyun") {
      setIsAliService(true);
    } else {
      setIsNoService(false);
      setIsLocalService(false);
      setIsTenService(false);
      setIsAliService(false);
    }
  }, [service]);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  useEffect(() => {
    if (list.length === 0) {
      return;
    }
    let newbox = [];
    let tenbox = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].storage_driver === "aliyun") {
        newbox.push(list[i].storage_file_id);
      }
      if (list[i].storage_driver === "tencent") {
        tenbox.push(list[i].storage_file_id);
      }
    }
    if (newbox.length > 0 && enabledAddons["AliyunHls"]) {
      getAliRecords(newbox);
    }
    if (tenbox.length > 0 && enabledAddons["TencentCloudHls"]) {
      getTenRecords(tenbox);
    }
  }, [list, enabledAddons]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    media
      .newVideoList({
        page: page,
        size: size,
        keywords: keywords,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
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
      title: "视频名称",
      dataIndex: "title",
      render: (title: string) => <span>{title}</span>,
    },
    {
      title: "视频时长",
      width: 150,
      render: (_, record: any) => (
        <DurationText duration={record.duration}></DurationText>
      ),
    },
    {
      title: "大小",
      width: 150,
      render: (_, record: any) => <div>{record.size_mb}MB</div>,
    },
    {
      title: "加密",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.storage_driver === "aliyun" &&
          checkTrans(record.storage_file_id) ? (
            <span>已加密</span>
          ) : record.storage_driver === "tencent" &&
            checkTenTrans(record.storage_file_id) ? (
            <span>已加密</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "上传时间",
      width: 200,
      render: (_, record: any) => <div>{dateFormat(record.created_at)}</div>,
    },
    {
      title: "操作",
      width: 120,
      render: (_, record: any) => (
        <Space>
          {record.storage_driver === "aliyun" && (
            <PerButton
              type="link"
              text="加密"
              class="c-primary"
              icon={null}
              p="ali-hls-transcode.submit"
              onClick={() => {
                submit(record.storage_file_id);
              }}
              disabled={null}
            />
          )}
          {record.storage_driver === "tencent" && (
            <PerButton
              type="link"
              text="加密"
              class="c-primary"
              icon={null}
              p="addons.TencentCloudHls.transcode.submit"
              onClick={() => {
                tenSubmit(record.storage_file_id);
              }}
              disabled={null}
            />
          )}
        </Space>
      ),
    },
  ];

  const checkTrans = (val: string) => {
    return typeof records[val] !== "undefined";
  };

  const checkTenTrans = (val: string) => {
    return typeof tenRecords[val] !== "undefined";
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      let arrLocal: any = [];
      let arr: any = [];
      selectedRows.map((item: any) => {
        if (item.storage_driver === "local") {
          arrLocal.push(item.storage_file_id);
        } else {
          arr.push(item.id);
        }
      });
      setSelectedRowKeys(selectedRowKeys);
      setSelectedOtherKeys(arr);
      setSelectedLocalKeys(arrLocal);
    },
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的视频？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        destoryConfirm();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const destoryConfirm = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      if (selectedLocalKeys.length > 0) {
        let localRes: any = await media.localDestroyVideo({
          ids: selectedLocalKeys,
        });
      }
      if (selectedOtherKeys.length > 0) {
        let otherRes: any = await media.newDestroyVideo({
          ids: selectedOtherKeys,
        });
      }
      message.success("成功");
      resetData();
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  const submit = (fileId: number) => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认加密选中的视频？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        let ids = [];
        ids.push(fileId);
        media.aliyunTranscode({ file_ids: ids }).then(() => {
          message.success("成功");
          resetData();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const tenSubmit = (fileId: number) => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认加密选中的视频？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        let ids = [];
        ids.push(fileId);
        media.tencentTranscode({ file_ids: ids }).then(() => {
          message.success("成功");
          resetData();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const getAliRecords = (newbox: any) => {
    media.aliyunTranscodeRecords({ file_ids: newbox }).then((res: any) => {
      if (res.data.records) {
        setRecords(res.data.records);
      }
    });
  };
  const getTenRecords = (newbox: any) => {
    media.tencentTranscodeRecords({ file_ids: newbox }).then((res: any) => {
      if (res.data) {
        setTenRecords(res.data);
      }
    });
  };

  const completeUpload = () => {
    setOpenUploadItem(false);
    resetData();
  };

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <Button
            type="primary"
            onClick={() => {
              if (isNoService) {
                message.warning("请先在系统配置的视频存储中完成参数配置");
                return;
              }
              setOpenUploadItem(true);
            }}
          >
            上传视频
          </Button>
          <PerButton
            type="danger"
            text="批量删除"
            class="ml-10"
            icon={null}
            p="media.video.delete.multi"
            onClick={() => destorymulti()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
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
      <UploadVideoItem
        open={openUploadItem}
        onCancel={() => setOpenUploadItem(false)}
        onSuccess={() => {
          completeUpload();
        }}
      ></UploadVideoItem>
    </div>
  );
};

export default ResourceVideosPage;
