import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "./index.module.scss";
import { Rnd } from "react-rnd";
import { ExclamationCircleFilled, DeleteOutlined } from "@ant-design/icons";
const { confirm } = Modal;

interface PropInterface {
  pWidth: number;
  pHeight: number;
  config: any;
  current: number;
  status: number;
  size: number;
  onDragend: (sign: string, x: number, y: number) => void;
  onChange: (width: number, height: number) => void;
  onDel: (current: number) => void;
  onActive: (current: number) => void;
}

export const RenderImage: React.FC<PropInterface> = ({
  pWidth,
  pHeight,
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
  const [x, setX] = useState(size * config.x - pWidth);
  const [y, setY] = useState(size * config.y - pHeight);

  useEffect(() => {
    if (config && size) {
      setWidth(size * config.width);
      setHeight(size * config.height);
      setX(size * config.x - pWidth);
      setY(size * config.y - pHeight);
    }
  }, [config, size, status, current, pWidth, pHeight]);

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
        console.log(d.x / size, d.y / size);
        onDragend("image-v1", (d.x + pWidth) / size, (d.y + pHeight) / size);
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
      <img src={config.url} style={{ width: "100%", height: "100%" }} />
      <div className={styles["item-options"]} style={{ top: 0, left: width }}>
        <div className={styles["btn-item"]} onClick={() => blockDestroy()}>
          <DeleteOutlined />
        </div>
      </div>
    </Rnd>
  );
};
