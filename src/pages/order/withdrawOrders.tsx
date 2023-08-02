import { useState, useEffect } from "react";
import { Table, Select, message, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { order } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton } from "../../components";
import { dateFormat } from "../../utils/index";
import { WithdrawDialog } from "./components/withdraw-dailog";
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

const WithdrawOrdersPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [user_id, setUserId] = useState("");
  const [status, setStatus] = useState(-1);
  const [showHandleWin, setShowHandleWin] = useState<boolean>(false);
  const statusRows = [
    {
      label: "全部",
      value: -1,
    },
    {
      label: "待处理",
      value: 0,
    },
    {
      label: "已处理",
      value: 5,
    },
    {
      label: "已驳回",
      value: 3,
    },
  ];

  useEffect(() => {
    document.title = "余额提现";
    dispatch(titleAction("余额提现"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    order
      .withdrawOrders({
        page: page,
        size: size,
        user_id: user_id,
        status: status,
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
    setSelectedRowKeys([]);
    setUserId("");
    setStatus(-1);
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
      title: "学员ID",
      width: 120,
      dataIndex: "user_id",
      render: (user_id: number) => <span>{user_id}</span>,
    },
    {
      title: "学员",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.nick_name}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: "提现金额",
      render: (_, record: any) => <span>{record.amount}元</span>,
    },
    {
      title: "收款人",
      width: 300,
      render: (_, record: any) => (
        <>
          <div>
            渠道：
            {record.channel === "alipay"
              ? "支付宝"
              : record.channel === "wechat"
              ? "微信"
              : record.channel}
          </div>
          <div>姓名：{record.channel_name}</div>
          <div>账号：{record.channel_account}</div>
        </>
      ),
    },
    {
      title: "状态",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.status === 5 && <span className="c-green">· 已处理</span>}
          {record.status === 3 && <span className="c-red">· 已驳回</span>}
          {record.status === 0 && <span className="c-yellow">· 待处理</span>}
        </>
      ),
    },
    {
      title: "备注",
      width: 300,
      render: (_, record: any) => <span>{record.remark}</span>,
    },
    {
      title: "申请时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 0, //禁用的条件
    }),
  };

  const handleMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    setShowHandleWin(true);
  };

  const importexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      user_id: user_id,
      status: status,
    };
    order.withdrawOrders(params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename = "余额提现.xlsx";
      let sheetName = "sheet1";

      let data = [
        [
          "学员ID",
          "学员",
          "金额",
          "收款人渠道",
          "收款人姓名",
          "收款人账号",
          "状态",
          "备注",
          "时间",
        ],
      ];
      res.data.data.forEach((item: any) => {
        let status;
        if (item.status === 0) {
          status = "待处理";
        } else if (item.status === 3) {
          status = "已驳回";
        } else if (item.status === 5) {
          status = "已处理";
        }
        data.push([
          item.user_id,
          item.user.nick_name,
          item.amount + "元",
          item.channel,
          item.channel_name,
          item.channel_account,
          status,
          item.remark,
          item.created_at
            ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
            : "",
        ]);
      });

      const jsonWorkSheet = XLSX.utils.json_to_sheet(data);
      const workBook: XLSX.WorkBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: jsonWorkSheet,
        },
      };
      XLSX.writeFile(workBook, filename);
      setLoading(false);
    });
  };

  return (
    <div className="meedu-main-body">
      <WithdrawDialog
        open={showHandleWin}
        ids={selectedRowKeys}
        onCancel={() => setShowHandleWin(false)}
        onSuccess={() => {
          setShowHandleWin(false);
          setSelectedRowKeys([]);
          setRefresh(!refresh);
        }}
      ></WithdrawDialog>
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="批量操作"
            class=""
            icon={null}
            p="addons.MultiLevelShare.withdraw.handle"
            onClick={() => handleMulti()}
            disabled={null}
          />
          <Button
            className="ml-10"
            type="primary"
            onClick={() => importexcel()}
          >
            导出表格
          </Button>
        </div>
        <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={status}
            onChange={(e) => {
              setStatus(e);
            }}
            allowClear
            placeholder="状态"
            options={statusRows}
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

export default WithdrawOrdersPage;
