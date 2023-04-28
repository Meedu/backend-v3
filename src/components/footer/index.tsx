import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        width: "100%",
        backgroundColor: "#F6F6F6",
        height: 166,
        paddingTop: 80,
        textAlign: "center",
      }}
    >
      <Link to="https://playedu.xyz/" target="blank">
        <i
          style={{ fontSize: 30, color: "#cccccc" }}
          className="iconfont icon-waterprint footer-icon"
          onClick={() => {}}
        ></i>
      </Link>
    </Layout.Footer>
  );
};
