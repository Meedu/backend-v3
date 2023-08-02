import React, { useState, useEffect } from "react";
import { QRCode, Modal } from "antd";
import styles from "./index.module.scss";
import { Rnd } from "react-rnd";
import { ExclamationCircleFilled, DeleteOutlined } from "@ant-design/icons";
const { confirm } = Modal;

interface PropInterface {
  config: any;
  current: number;
  status: number;
  size: number;
  onDragend: (sign: string, x: number, y: number) => void;
  onChange: (width: number, height: number) => void;
  onDel: (current: number) => void;
  onActive: (current: number) => void;
}

export const RenderQrcode: React.FC<PropInterface> = ({
  config,
  current,
  status,
  size,
  onDragend,
  onChange,
  onDel,
  onActive,
}) => {
  const [width, setWidth] = useState(size * config.width);
  const [height, setHeight] = useState(size * config.height);
  const [x, setX] = useState(size * config.x);
  const [y, setY] = useState(size * config.y);

  useEffect(() => {
    console.log(config);
    if (config && size) {
      setWidth(size * config.width);
      setHeight(size * config.height);
      setX(size * config.x);
      setY(size * config.y);
    }
  }, [config, size, status, current]);

  const blockDestroy = () => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        onDel(current);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Rnd
      default={{
        x: x,
        y: y,
        width: width,
        height: height,
      }}
      position={{ x: x, y: y }}
      onDrag={(e, d) => {
        setX(d.x);
        setY(d.y);
        onDragend("qrcode-v1", d.x / size, d.y / size);
      }}
      onResize={(e, direction, ref: any, delta, position) => {
        setWidth(parseInt(ref.style.width));
        setHeight(parseInt(ref.style.height));
        onChange(
          parseInt(ref.style.width) / size,
          parseInt(ref.style.height) / size
        );
      }}
      onMouseDown={() => onActive(current)}
    >
      <div
        style={{
          width: width,
          height: height,
          backgroundColor: status === current ? "#ffffff" : "",
        }}
      >
        <QRCode
          size={width <= height ? width : height}
          bordered={false}
          value={config.text}
        />
      </div>
      {status === current && (
        <div className={styles["item-options"]} style={{ top: 0, left: width }}>
          <div className={styles["btn-item"]} onClick={() => blockDestroy()}>
            <DeleteOutlined />
          </div>
        </div>
      )}
    </Rnd>
  );
};
