import React, { useState, useEffect } from "react";
import { Modal } from "antd";
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
  onDel: (current: number) => void;
  onActive: (current: number) => void;
}

export const RenderText: React.FC<PropInterface> = ({
  config,
  current,
  status,
  size,
  onDragend,
  onDel,
  onActive,
}) => {
  const [x, setX] = useState(size * config.x);
  const [y, setY] = useState(size * config.y);

  useEffect(() => {
    if (config && size) {
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
      position={{ x: x, y: y }}
      onDrag={(e, d) => {
        setX(d.x);
        setY(d.y);
        onDragend("text-v1", d.x / size, d.y / size);
      }}
      onMouseDown={() => onActive(current)}
    >
      <div
        className={styles["text"]}
        style={{ fontSize: size * config.size, color: config.color }}
      >
        {config.text}
      </div>
      {status === current && (
        <div className={styles["item-options"]} style={{ top: -2, right: -38 }}>
          <div className={styles["btn-item"]} onClick={() => blockDestroy()}>
            <DeleteOutlined />
          </div>
        </div>
      )}
    </Rnd>
  );
};
