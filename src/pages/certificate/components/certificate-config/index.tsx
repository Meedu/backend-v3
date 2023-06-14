import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import styles from "./index.module.scss";
import { SelectImage } from "../../../../components";

interface PropInterface {
  block: any;
  onCreate: (block: any, val: boolean) => void;
  onChange: (block: any, val: boolean) => void;
}

export const CertificateConfig: React.FC<PropInterface> = ({
  block,
  onCreate,
  onChange,
}) => {
  const [obj, setObj] = useState<any>(null);
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    if (block) {
      setObj(block);
    }
  }, [block]);

  useEffect(() => {
    onChange(obj, showUploadImage);
  }, [showUploadImage]);

  const createQrcode = () => {
    setStatus(!status);
    onCreate(obj, !status);
  };

  const addNick = () => {
    const box = { ...obj };
    box.config.text += "${user.nick_name}";
    setObj(box);
  };

  const addMobile = () => {
    const box = { ...obj };
    box.config.text += "${user.mobile}";
    setObj(box);
    onChange(obj, false);
  };

  const addNo = () => {
    const box = { ...obj };
    box.config.text += "${cert.no}";
    setObj(box);
    onChange(obj, false);
  };

  const addRealname = () => {
    const box = { ...obj };
    box.config.text += "${profile.real_name}";
    setObj(box);
    onChange(obj, false);
  };

  const addIdno = () => {
    const box = { ...obj };
    box.config.text += "${profile.id_number}";
    setObj(box);
    onChange(obj, false);
  };

  const addAge = () => {
    const box = { ...obj };
    box.config.text += "${profile.age}";
    setObj(box);
    onChange(obj, false);
  };

  const addGender = () => {
    const box = { ...obj };
    box.config.text += "${profile.gender}";
    setObj(box);
    onChange(obj, false);
  };

  return (
    <>
      {obj && (
        <div className={styles["config-index-box"]}>
          {obj.sign === "text-v1" && (
            <div className={styles["config"]}>
              <div className={styles["title"]}>
                <div className={styles["text"]}>文本</div>
              </div>
              {obj.config && (
                <div className={styles["config-item"]}>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left">
                      <div className={styles["form-label"]}>文字内容</div>
                      <div className={styles["import-box"]}>
                        <div className={styles["label-item"]}>插入变量：</div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addNick()}
                        >
                          用户名
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addMobile()}
                        >
                          手机号
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addNo()}
                        >
                          证书编号
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addRealname()}
                        >
                          真实姓名
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addIdno()}
                        >
                          身份证号
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addAge()}
                        >
                          年龄
                        </div>
                        <div
                          className={styles["import-item"]}
                          onClick={() => addGender()}
                        >
                          性别
                        </div>
                      </div>
                      <div className="float-left d-flex">
                        <Input.TextArea
                          value={obj.config.text}
                          rows={4}
                          allowClear
                          onChange={(e) => {
                            const box = { ...obj };
                            box.config.text = e.target.value;
                            setObj(box);
                            onChange(obj, false);
                          }}
                          style={{ width: "100%", resize: "none" }}
                          placeholder="此处填写文字内容"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>大小</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.size}
                          type="number"
                          allowClear
                          onChange={(e) => {
                            const box = { ...obj };
                            box.config.size = e.target.value;
                            setObj(box);
                            onChange(obj, false);
                          }}
                          style={{ width: "100%" }}
                          placeholder="此处填写文字大小"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>颜色</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.color}
                          type="color"
                          onChange={(e) => {
                            const box = { ...obj };
                            box.config.color = e.target.value;
                            setObj(box);
                            onChange(obj, false);
                          }}
                          style={{ width: 32, padding: 0 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {obj.sign === "image-v1" && (
            <div className={styles["config"]}>
              <div className={styles["title"]}>
                <div className={styles["text"]}>图片</div>
              </div>
              {obj.config && (
                <div className={styles["config-item"]}>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>宽度</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.width}
                          type="number"
                          disabled
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>高度</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.height}
                          type="number"
                          disabled
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <Button onClick={() => setShowUploadImage(true)}>
                        上传图片
                      </Button>
                    </div>
                    <div className="float-left d-flex w-100 mt-15">
                      <img
                        className={styles["pre-icon"]}
                        src={obj.config.url}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {obj.sign === "qrcode-v1" && (
            <div className={styles["config"]}>
              <div className={styles["title"]}>
                <div className={styles["text"]}>证书二维码</div>
              </div>
              {obj.config && (
                <div className={styles["config-item"]}>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>宽度</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.width}
                          type="number"
                          disabled
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["config-item-body"]}>
                    <div className="float-left d-flex">
                      <div className={styles["new-form-label"]}>高度</div>
                      <div className="flex-1 ml-15">
                        <Input
                          value={obj.config.height}
                          type="number"
                          disabled
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <SelectImage
            open={showUploadImage}
            from={1}
            onCancel={() => setShowUploadImage(false)}
            onSelected={(url) => {
              const box = { ...obj };
              if (box.sign === "image-v1") {
                box.config.url = url;
                setObj(box);
                setShowUploadImage(false);
              }
            }}
          ></SelectImage>
        </div>
      )}
    </>
  );
};
