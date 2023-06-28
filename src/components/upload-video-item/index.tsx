import { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Progress,
  message,
  Table,
  Tag,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Dragger from "antd/es/upload/Dragger";
import { media } from "../../api";
import { parseVideo, getToken, checkUrl } from "../../utils/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import config from "../../js/config";
import TcVod from "vod-js-sdk-v6";
const { confirm } = Modal;

interface PropInterface {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

declare const window: any;

export const UploadVideoItem: React.FC<PropInterface> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const upRef = useRef(0);
  const [isNoService, setIsNoService] = useState(false);
  const [isLocalService, setIsLocalService] = useState(false);
  const [isTenService, setIsTenService] = useState(false);
  const [isAliService, setIsAliService] = useState(false);
  const localFileList = useRef<any>([]);
  const [fileList, setFileList] = useState<any>([]);
  const aliRef = useRef<any>(null);
  const [upload, setUpload] = useState<any>({
    // 阿里云obj
    aliyun: null,
    //plupload本地
    up: null,
    //腾讯云
    ten: null,
    // 上传服务商
    service: null,
    // 是否上传中
    loading: false,
    // 上传进度
    process: 0,
    // 本地视频文件信息
    file: null,
    // 上传成功视频文件id
    fileId: null,
  });
  const user = useSelector((state: any) => state.loginUser.value.user);
  const service = useSelector(
    (state: any) => state.systemConfig.value.video.default_service
  );

  useEffect(() => {
    let obj = { ...upload };
    if (service === "") {
      obj.service = null;
      setIsNoService(true);
    } else if (service === "local") {
      obj.service = "local";
      setIsLocalService(true);
    } else if (service === "tencent") {
      obj.service = "tencent";
      setIsTenService(true);
    } else if (service === "aliyun") {
      obj.service = "aliyun";
      setIsAliService(true);
      aliyunInit();
    } else {
      obj.service = null;
      setIsNoService(false);
      setIsLocalService(false);
      setIsTenService(false);
      setIsAliService(false);
    }
    setUpload(obj);
  }, [service]);

  const aliyunInit = () => {
    aliRef.current = new window.AliyunUpload.Vod({
      partSize: 1048576,
      parallel: 5,
      retryCount: 3,
      retryDuration: 2,
      onUploadstarted: (uploadInfo: any) => {
        if (uploadInfo.videoId) {
          media
            .videoAliyunTokenRefresh({
              video_id: uploadInfo.videoId,
            })
            .then((res: any) => {
              aliRef.current.setUploadAuthAndAddress(
                uploadInfo,
                res.data.upload_auth,
                res.data.upload_address,
                res.data.video_id
              );
            });
        } else {
          media
            .videoAliyunTokenCreate({
              title: uploadInfo.file.name,
              filename: uploadInfo.file.name,
            })
            .then((res: any) => {
              aliRef.current.setUploadAuthAndAddress(
                uploadInfo,
                res.data.upload_auth,
                res.data.upload_address,
                res.data.video_id
              );
            });
        }
      },
      onUploadSucceed: (uploadInfo: any) => {
        let obj = { ...upload };
        obj.fileId = uploadInfo.videoId;
        setUpload(obj);
        let fileId = uploadInfo.videoInfo.CateId;
        let it = localFileList.current.find((o: any) => o.id === fileId);
        if (it) {
          it.status = 7;
          it.result = null;
          uploadSuccess(uploadInfo.videoId, "", fileId);
        }
        setFileList([...localFileList.current]);
      },
      onUploadFailed: (uploadInfo: any, code: any, message: any) => {
        upRef.current--;
        let obj = { ...upload };
        obj.loading = false;
        setUpload(obj);
        let fileId = uploadInfo.videoInfo.CateId;
        let it = localFileList.current.find((o: any) => o.id === fileId);
        if (it) {
          it.status = 5;
          it.result = message;
          uploadFailHandle(message);
        }
        setFileList([...localFileList.current]);
      },
      onUploadCanceled: (uploadInfo: any, message: any) => {
        console.log(message);
      },
      onUploadProgress: (
        uploadInfo: any,
        totalSize: any,
        loadedPercent: any
      ) => {
        let fileId = uploadInfo.videoInfo.CateId;
        let it = localFileList.current.find((o: any) => o.id === fileId);
        if (it) {
          it.status = 1;
          it.progress = Math.floor(loadedPercent * 100);
        }
        setFileList([...localFileList.current]);
      },
      onUploadTokenExpired: (uploadInfo: any) => {
        media
          .videoAliyunTokenRefresh({
            video_id: uploadInfo.videoId,
          })
          .then((res: any) => {
            aliRef.current.resumeUploadWithAuth(res.data.upload_auth);
          });
      },
    });
  };

  const uploadProps = {
    multiple: true,
    beforeUpload: async (file: File) => {
      if (file.type === "video/mp4") {
        let obj = { ...upload };
        obj.loading = true;
        setUpload(obj);
        // 视频封面解析 || 视频时长解析
        let videoInfo = await parseVideo(file);
        // 添加到本地待上传
        upRef.current++;
        let fileId = Math.random() * 100 + file.name;
        let item: any = {
          id: fileId,
          file: file,
          size: file.size,
          result: {
            fileId: fileId,
            up: null,
          },
          progress: 0,
          status: 1,
        };
        item.file.duration = videoInfo.duration;
        localFileList.current.push(item);
        setFileList([...localFileList.current]);

        if (obj.service === "aliyun") {
          aliyunUploadHandle(fileId, file);
        } else if (obj.service === "tencent") {
          tencentUploadHandle(fileId, file);
        } else if (obj.service === "local") {
        }
      } else {
        message.error(`${file.name} 并不是 mp4 视频文件`);
      }
    },
    showUploadList: false,
  };

  const aliyunUploadHandle = (fileId: any, file: any) => {
    if (aliRef.current) {
      aliRef.current.addFile(
        file,
        null,
        null,
        null,
        JSON.stringify({
          Vod: { CateId: fileId },
        })
      );
      aliRef.current.startUpload();
    }
  };

  const tencentUploadHandle = (fileId: any, file: any) => {
    const tcVod = new TcVod({
      getSignature: () => {
        return media.videoTencentToken({}).then((res: any) => {
          return res.data.signature;
        });
      },
    });
    const uploader = tcVod.upload({
      mediaFile: file,
    });
    uploader.on("media_progress", (info) => {
      let it = localFileList.current.find((o: any) => o.id === fileId);
      it.result.up = uploader;
      it.status = 1;
      it.progress = Math.floor(info.percent * 100);
      setFileList([...localFileList.current]);
    });

    uploader
      .done()
      .then((doneResult) => {
        let obj = { ...upload };
        obj.fileId = doneResult.fileId;
        setUpload(obj);
        uploadSuccess(doneResult.fileId, "", fileId);
      })
      .catch((err) => {
        upRef.current--;
        let it = localFileList.current.find((o: any) => o.id === fileId);
        it.status = 5;
        it.result = err.message;
        setFileList([...localFileList.current]);
        uploadFailHandle(err.message);
      });
    let obj = { ...upload };
    obj.ten = uploader;
    setUpload(obj);
  };

  const uploadSuccess = (fileId: any, thumb: string, id: any) => {
    upRef.current--;
    let it = localFileList.current.find((o: any) => o.id === id);
    it.status = 7;
    it.result = null;
    setFileList([...localFileList.current]);
    let obj = { ...upload };
    obj.loading = false;
    setUpload(obj);
    media
      .storeVideo({
        title: it.file.name,
        duration: it.file.duration,
        thumb: thumb,
        size: it.size,
        storage_driver: obj.service,
        storage_file_id: fileId,
      })
      .then((res) => {
        message.success("上传成功");
      });
  };

  const uploadFailHandle = (msg: any) => {
    let obj = { ...upload };
    obj.loading = false;
    obj.fileId = null;
    setUpload(obj);
    message.error(msg);
  };

  const closeWin = () => {
    setFileList([]);
    localFileList.current = [];
    onSuccess();
  };

  const cancelTask = (result: any) => {
    if (isLocalService) {
      var fileItem = result.up.getFile(result.fileId);
      fileItem && result.up.removeFile(fileItem);
    } else if (isAliService) {
      let index = localFileList.current.findIndex(
        (o: any) => o.id === result.fileId
      );
      index && upload.aliyun && upload.aliyun.cancelFile(index);
      index && upload.aliyun && upload.aliyun.deleteFile(index);
      setFileList([...localFileList.current]);
    } else if (isTenService) {
      if (!result.up) {
        message.warning("请稍后取消");
        return;
      }
      result.up.cancel();
    }
    localFileList.current = localFileList.current.filter((item: any) => {
      return item.id != result.fileId;
    });
    setFileList([...localFileList.current]);
    upRef.current--;
    if (upRef.current === 0) {
      let obj = { ...upload };
      obj.loading = false;
      setUpload(obj);
    }
  };

  return (
    <>
      <Modal
        title=""
        centered
        forceRender
        open={open}
        width={800}
        onCancel={() => {
          onCancel();
        }}
        footer={[
          <Button
            loading={upload.loading || upRef.current > 0}
            key="submit"
            type="primary"
            onClick={closeWin}
          >
            完成
          </Button>,
        ]}
        maskClosable={false}
        closable={false}
      >
        <div className={styles["header"]}>上传列表</div>
        <div className={styles["body"]}>
          <Row gutter={[0, 10]}>
            <Col span={24}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">拖入视频文件至此区域</p>
                <p className="ant-upload-hint">
                  支持多个视频同时上传 / 仅支持mp4格式
                </p>
              </Dragger>
            </Col>
            <Col span={24}>
              <Col span={24}>
                <Table
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: "视频",
                      dataIndex: "file.name",
                      key: "file.name",
                      render: (_, record) => <span>{record.file.name}</span>,
                    },
                    {
                      title: "大小",
                      dataIndex: "file.size",
                      key: "file.size",
                      render: (_, record) => (
                        <span>
                          {(record.file.size / 1024 / 1024).toFixed(2)} M
                        </span>
                      ),
                    },
                    {
                      title: "进度",
                      dataIndex: "progress",
                      key: "progress",
                      render: (_, record: any) => (
                        <>
                          {record.progress === 0 && "等待上传"}
                          {record.progress > 0 && (
                            <Progress
                              size="small"
                              steps={20}
                              percent={record.progress}
                            />
                          )}
                        </>
                      ),
                    },
                    {
                      title: "操作",
                      key: "action",
                      render: (_, record) => (
                        <>
                          {record.progress > 0 && record.status === 1 && (
                            <Button
                              type="link"
                              onClick={() => {
                                cancelTask(record.result);
                              }}
                            >
                              取消
                            </Button>
                          )}

                          {record.status === 5 && (
                            <>
                              <Tag color="error">失败：{record.result}</Tag>
                            </>
                          )}
                          {record.status === 7 && (
                            <>
                              <Tag color="success">成功</Tag>
                            </>
                          )}
                        </>
                      ),
                    },
                  ]}
                  dataSource={fileList}
                />
              </Col>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
