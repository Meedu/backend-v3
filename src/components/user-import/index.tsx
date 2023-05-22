import React, { useState, useEffect } from "react";
import { Modal, message, Upload, Button } from "antd";
import styles from "./index.module.scss";
import { certificate } from "../../api/index";
import * as XLSX from "xlsx";

interface PropInterface {
  id: number;
  type: string;
  open: boolean;
  name: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserImportDialog: React.FC<PropInterface> = ({
  id,
  type,
  open,
  name,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, [open]);

  const mode = () => {};

  const uploadProps = {
    accept: ".xls,.xlsx,application/vnd.ms-excel",
    beforeUpload: (file: any) => {
      if (loading) {
        return;
      }
      setLoading(true);
      const f = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const datas = e.target.result;
        const workbook = XLSX.read(datas, {
          type: "binary",
        });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {
          header: 1,
        });
        handleImpotedJson(jsonArr, file);
      };
      reader.readAsBinaryString(f);
      return false;
    },
  };

  const handleImpotedJson = (jsonArr: any[], file: any) => {
    jsonArr.splice(0, 1); // 去掉表头[第一行规则描述,第二行表头名]
    let data: any[] = [];
    for (let i = 0; i < jsonArr.length; i++) {
      let tmpItem = jsonArr[i];
      if (typeof tmpItem === undefined) {
        break;
      }
      if (tmpItem.length === 0) {
        //空行
        continue;
      }
      let arr: any = [];
      tmpItem.map((item: any) => {
        arr.push(item);
      });
      data.push(arr);
    }

    if (type === "cert") {
      storeBatchTableCertData(data);
    }
  };

  const storeBatchTableCertData = (data: any) => {
    certificate
      .userImport(id, { data: data })
      .then(() => {
        setLoading(false);
        message.success("导入成功！");
        onSuccess();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        title=""
        centered
        forceRender
        open={open}
        width={900}
        onCancel={() => {
          onCancel();
        }}
        maskClosable={false}
        closable={false}
        footer={null}
      >
        <div className={styles["header"]}>学员批量导入</div>
        <div className={styles["body"]}>
          <div className="d-flex float-left">
            <div>
              <Upload {...uploadProps} showUploadList={false}>
                <Button loading={loading} type="primary">
                  选择Excel表格文件
                </Button>
              </Upload>
            </div>
            <div className="ml-30">
              <Button type="link" className="c-primary" onClick={() => mode()}>
                点击链接下载「{name || "学员批量导入模板"}」
              </Button>
            </div>
          </div>
        </div>
        <div
          slot="footer"
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <Button onClick={() => onCancel()}>取消</Button>
        </div>
      </Modal>
    </>
  );
};
