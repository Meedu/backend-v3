import { useEffect, useState } from "react";
import { Table, Button, Tag, Select, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { paper } from "../../../../api/index";
import { dateFormat } from "../../../../utils/index";
import { DurationText, PerButton } from "../../../../components";
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
  const [status, setStatus] = useState(-1);
  const [statusMapRows, setStatusMapRows] = useState<any>([]);

  useEffect(() => {
    getData();
  }, [props.id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    paper
      .userPaper(props.id, {
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        user_id: null,
        created_at: null,
        submit_at: null,
        status: status,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);

        let statusMap = [
          {
            text: "全部",
            id: -1,
          },
        ];
        statusMap.push(...res.data.statusMap);
        let box: any = [];
        statusMap.map((item: any) => {
          box.push({
            label: item.text,
            value: item.id,
          });
        });
        setStatusMapRows(box);
        setLoading(false);
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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
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
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
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
      title: "得分",
      width: 150,
      render: (_, record: any) => (
        <>{record.status === 2 && <span>{record.score}分</span>}</>
      ),
    },
    {
      title: "用时",
      render: (_, record: any) => (
        <>
          {record.status === 2 && (
            <DurationText duration={record.used_seconds}></DurationText>
          )}
        </>
      ),
    },
    {
      title: "状态",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.status === 2 && <Tag color="success">已结束</Tag>}
          {record.status === 0 && <Tag color="default">未开始</Tag>}
          {record.status === 3 && <Tag color="warning">阅卷中</Tag>}
          {record.status === 1 && <Tag color="processing">考试中</Tag>}
        </>
      ),
    },
    {
      title: "开始时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "交卷时间",
      width: 200,
      dataIndex: "submit_at",
      render: (submit_at: string) => <span>{dateFormat(submit_at)}</span>,
    },
    {
      title: "操作",
      width: 100,
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          {record.status === 3 && (
            <PerButton
              type="link"
              text="阅卷"
              class="c-primary"
              icon={null}
              p="addons.Paper.paper.userPaper.submit"
              onClick={() => {
                navigate(
                  "/exam/paper/marking?id=" +
                    props.id +
                    "&user_paper_id=" +
                    record.id
                );
              }}
              disabled={null}
            />
          )}
          <PerButton
            type="link"
            text="查看"
            class="c-primary"
            icon={null}
            p="addons.Paper.paper.userPaper.render"
            onClick={() => {
              navigate(
                "/exam/paper/paperShow?id=" +
                  record.paper_id +
                  "&pid=" +
                  record.id
              );
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const durationTime = (duration: number) => {
    let hour: any = Math.floor(duration / 3600);
    let minute: any = Math.floor((duration - hour * 3600) / 60);
    let second: any = duration - hour * 3600 - minute * 60;
    if (hour === 0 && minute === 0 && second === 0) {
      return null;
    }
    if (hour === 0) {
      hour = "";
    } else {
      hour = hour + ":";
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    return hour + minute + ":" + second;
  };

  const importexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      sort: "id",
      order: "desc",
      user_id: null,
      created_at: null,
      submit_at: null,
      status: status,
    };
    paper.userPaper(props.id, params).then((res: any) => {
      if (res.data.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }

      let filename = "考试卷考试记录.xlsx";
      let sheetName = "sheet1";

      let data = [
        [
          "学员ID",
          "学员",
          "手机号",
          "得分",
          "用时",
          "状态",
          "开始时间",
          "交卷时间",
        ],
      ];
      res.data.data.data.forEach((item: any) => {
        data.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          item.score + "分",
          durationTime(item.used_seconds),
          item.status_text,
          item.created_at
            ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
            : "",
          item.submit_at
            ? moment(item.submit_at).format("YYYY-MM-DD HH:mm")
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
    <div className="float-left">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <Button type="primary" onClick={() => importexcel()}>
            导出表格
          </Button>
        </div>
        <div className="d-flex">
          <Select
            style={{ width: 150 }}
            value={status}
            onChange={(e) => {
              setStatus(e);
            }}
            allowClear
            placeholder="看完"
            options={statusMapRows}
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
