import { useEffect, useState } from "react";
import { Modal, Table, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { paper } from "../../../../api/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PerButton, UserAddDialog } from "../../../../components";
const { confirm } = Modal;
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  user_id: number;
}

interface PropsInterface {
  id: number;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
}

export const SubUsers = (props: PropsInterface) => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [showUserAddWin, setShowUserAddWin] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    paper
      .userList(props.id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.page !== "undefined") {
          prev.set("page", params.page + "");
        }
        if (typeof params.size !== "undefined") {
          prev.set("size", params.size + "");
        }
        return prev;
      },
      { replace: true }
    );
  };

  const delRecords = (uid: number) => {
    if (uid === 0) {
      return;
    }
    confirm({
      title: "警告",
      icon: <ExclamationCircleFilled />,
      content: "确认操作？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        paper
          .userDel(props.id, uid)
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
    resetLocalSearchParams({
      page: 1,
    });
    setList([]);
    setRefresh(!refresh);
  };

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
    });
    setList([]);
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
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员ID",
      width: 80,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "手机号",
      width: 150,
      render: (_, record: any) => (
        <>{record.user && <span>{record.user.mobile}</span>}</>
      ),
    },
    {
      title: "学员",
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
      title: "操作",
      width: 100,
      fixed: "right",
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.Paper.paper.users.delete"
          onClick={() => {
            delRecords(record.user_id);
          }}
          disabled={null}
        />
      ),
    },
  ];

  const importexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
    };
    paper.userList(props.id, params).then((res: any) => {
      if (res.data.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename = "考试卷订阅学员.xlsx";
      let sheetName = "sheet1";

      let data = [["学员ID", "学员", "手机号", "时间"]];
      res.data.data.data.forEach((item: any) => {
        data.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          moment(item.created_at).format("YYYY-MM-DD HH:mm"),
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

  const userAddChange = (rows: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    paper
      .userAdd(props.id, {
        id: props.id,
        mobiles: rows,
      })
      .then(() => {
        setLoading(false);
        message.success("成功");
        setShowUserAddWin(false);
        resetData();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="float-left">
      <div className="float-left  mb-30">
        <PerButton
          type="primary"
          text="添加学员"
          class=""
          icon={null}
          p="addons.Paper.paper.users.add"
          onClick={() => setShowUserAddWin(true)}
          disabled={null}
        />
        <Button className="ml-10" type="primary" onClick={() => importexcel()}>
          导出表格
        </Button>
      </div>
      <div className="float-left">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={paginationProps}
        />
      </div>
      <UserAddDialog
        type="mobile"
        open={showUserAddWin}
        onCancel={() => setShowUserAddWin(false)}
        onSuccess={(rows: any) => {
          userAddChange(rows);
        }}
      ></UserAddDialog>
    </div>
  );
};
