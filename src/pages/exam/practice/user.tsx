import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { practice } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment, UserAddDialog } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  created_at: string;
}

const PracticeUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [progress, setProgress] = useState<any>({});
  const [showUserAddWin, setShowUserAddWin] = useState<boolean>(false);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "参与学员";
    dispatch(titleAction("参与学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .userList(id, {
        page: page,
        size: size,
        id: id,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setQuestionCount(res.data.question_count);
        setProgress(res.data.progress);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
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
      title: "学员ID",
      width: 120,
      render: (_, record: any) => <span>{record.user_id}</span>,
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
      title: "已练习",
      width: 200,
      render: (_, record: any) => (
        <>
          <div>总试题：{questionCount}题</div>
          {progress[record.user_id] ? (
            <div className="c-red">
              已练习：{progress[record.user_id].submit_count}题
            </div>
          ) : (
            <div className="c-red">已练习：0题</div>
          )}
        </>
      ),
    },
    {
      title: "练习进度",
      render: (_, record: any) => (
        <>
          {progress[record.user_id] ? (
            <div>
              {(
                (progress[record.user_id].submit_count * 100) /
                questionCount
              ).toFixed(2)}
              %
            </div>
          ) : (
            <div>0%</div>
          )}
        </>
      ),
    },
    {
      title: "操作",
      width: 120,
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="详细"
            class="c-primary"
            icon={null}
            p="addons.Paper.practice.user.progress"
            onClick={() => {
              navigate(
                "/exam/practice/progress?id=" + id + "&pid=" + record.user_id
              );
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.Paper.practice.user.delete"
            onClick={() => {
              destory(record.user_id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const destory = (pid: number) => {
    if (pid === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此学员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        practice
          .userDel(id, {
            id: id,
            user_id: pid,
          })
          .then(() => {
            setLoading(false);
            message.success("删除成功");
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

  const userAddChange = (rows: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .userAdd(id, {
        id: id,
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

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const exportexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
    };
    practice.userList(id, params).then((res: any) => {
      if (res.data.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }

      let data = res.data.data.data;
      let questionCount = res.data.question_count;
      let practiceProgress = res.data.progress;
      let filename =
        "练习进度|" + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx";
      let sheetName = "sheet1";

      let rows = [
        ["用户ID", "用户名", "手机号", "总题目数", "已练习题目数", "进度"],
      ];
      data.forEach((item: any) => {
        if (!item.user) {
          return;
        }

        let p: any = 0;
        if (questionCount > 0 && practiceProgress[item.user_id]) {
          p = (
            (practiceProgress[item.user_id].submit_count / questionCount) *
            100
          ).toFixed(2);
        }

        rows.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          questionCount,
          practiceProgress[item.user_id]
            ? practiceProgress[item.user_id].submit_count
            : 0,
          p + "%",
        ]);
      });

      const jsonWorkSheet = XLSX.utils.json_to_sheet(rows);
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
      <BackBartment title="参与学员" />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="primary"
          text="添加学员"
          class=""
          icon={null}
          p="addons.Paper.practice.user.insert"
          onClick={() => setShowUserAddWin(true)}
          disabled={null}
        />

        <Button className="ml-10" type="primary" onClick={() => exportexcel()}>
          导出记录
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

export default PracticeUsersPage;
