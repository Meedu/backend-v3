import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { practice } from "../../../../api/index";
import { PerButton } from "../../../../components";
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  created_at: string;
  submit_at: string;
}

interface PropsInterface {
  id: number;
}

export const WatchRecords = (props: PropsInterface) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    practice
      .userPaper(props.id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setQuestionCount(res.data.question_count);
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
          {record.submit_count > 0 ? (
            <div className="c-red">已练习：{record.submit_count}题</div>
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
          {record.submit_count > 0 ? (
            <div>
              {((record.submit_count * 100) / questionCount).toFixed(2)}%
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
                "/exam/practice/progress?id=" +
                  props.id +
                  "&pid=" +
                  record.user_id
              );
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

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
    practice.userPaper(props.id, params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }

      let data = res.data.data;
      let questionCount = res.data.question_count;
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
        if (questionCount > 0 && item.submit_count > 0) {
          p = ((item.submit_count / questionCount) * 100).toFixed(2);
        }
        rows.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          questionCount,
          item.submit_count > 0 ? item.submit_count : 0,
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
    <div className="float-left">
      <div className="float-left mb-30">
        <Button type="primary" onClick={() => exportexcel()}>
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
    </div>
  );
};
