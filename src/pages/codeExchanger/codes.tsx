import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { codeExchanger } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  code: string;
  used_at: string;
}

const CodeExchangerCodesPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [code, setCode] = useState<string>("");
  const [user_id, setUserId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "兑换码";
    dispatch(titleAction("兑换码"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    codeExchanger
      .codesList(id, {
        page: page,
        size: size,
        is_used: -1,
        code: code,
        user_id: user_id,
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
    setSize(50);
    setList([]);
    setSelectedRowKeys([]);
    setCode("");
    setUserId("");
    setRefresh(!refresh);
  };

  const getnum = (num: number) => {
    confirm({
      title: "警告",
      icon: <ExclamationCircleFilled />,
      content: "确认操作",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        codeExchanger
          .generateCodes(id, { num: num })
          .then(() => {
            setLoading(false);
            message.success("成功");
            resetData();
          })
          .catch((e) => {
            setLoading(false);
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
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const importcode = () => {
    function sheet2blob(sheet: any, sheetName: any) {
      sheetName = sheetName || "sheet1";
      var workbook: any = {
        SheetNames: [sheetName],
        Sheets: {},
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts: any = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary",
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      // 字符串转ArrayBuffer
      function s2ab(s: any) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return blob;
    }

    function openDownloadDialog(url: any, saveName: any) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 添加blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    }

    let params = {};
    Object.assign(params, {
      is_used: 0,
      code: code,
      user_id: user_id,
    });
    Object.assign(params, {
      page: 1,
      size: total,
    });

    codeExchanger.codesList(id, params).then((res: any) => {
      let header = [["兑换码"]];
      res.data.data.forEach((item: any) => {
        header.push([item.code]);
      });
      let sheet = XLSX.utils.aoa_to_sheet(header);
      let data = sheet2blob(sheet, "兑换码.xlsx");
      openDownloadDialog(data, "兑换码.xlsx");
    });
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的兑换码？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        codeExchanger
          .destoryMultiCodes(id, {
            ids: selectedRowKeys,
          })
          .then(() => {
            message.success("成功");
            resetList();
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
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

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "兑换码",
      dataIndex: "code",
      render: (code: string) => <span>{code}</span>,
    },
    {
      title: "是否使用",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.is_used === 1 && <span className="c-red">· 已使用</span>}
          {record.is_used !== 1 && <span className="c-gray">· 未使用</span>}
        </>
      ),
    },
    {
      title: "学员ID",
      width: 120,
      render: (_, record: any) => (
        <>{record.used_user_id !== 0 && <span>{record.used_user_id}</span>}</>
      ),
    },
    {
      title: "学员",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.is_used === 1 && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user?.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user?.nick_name}</div>
            </div>
          )}
        </>
      ),
    },
    {
      title: "使用时间",
      width: 200,
      dataIndex: "used_at",
      render: (used_at: string) => <span>{dateFormat(used_at)}</span>,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="兑换码" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="生成10个"
            class=""
            icon={null}
            p="addons.CodeExchanger.activity-code.generate"
            onClick={() => getnum(10)}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="生成50个"
            class="ml-10"
            icon={null}
            p="addons.CodeExchanger.activity-code.generate"
            onClick={() => getnum(50)}
            disabled={null}
          />
          <Button type="primary" className="ml-10" onClick={() => importcode()}>
            导出未使用兑换码
          </Button>
          <PerButton
            type="danger"
            text="批量删除"
            class="ml-10"
            icon={null}
            p="addons.CodeExchanger.activity-code.destroy"
            onClick={() => destorymulti()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="兑换码"
          />
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="学员ID"
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

export default CodeExchangerCodesPage;
