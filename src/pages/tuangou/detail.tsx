import { useState, useEffect } from "react";
import { Table } from "antd";
import { useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { tuangou } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";
import { dateFormat } from "../../utils/index";

interface DataType {
  id: React.Key;
  created_at: string;
}

const TuangouTuanDetailPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [goods, setGoods] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [tid, setTid] = useState(Number(result.get("tid")));

  useEffect(() => {
    document.title = "团列表详情";
    dispatch(titleAction("团列表详情"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setTid(Number(result.get("tid")));
  }, [result.get("id"), result.get("tid")]);

  useEffect(() => {
    getData();
  }, [id, tid, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    tuangou
      .tuanDetail(id, tid)
      .then((res: any) => {
        setList(res.data.item);
        setUsers(res.data.users);
        setGoods(res.data.goods);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 80,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "团员",
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
      title: "加入日期",
      width: 300,
      render: (_, record: any) => <div>{dateFormat(record.created_at)}</div>,
    },
  ];

  return (
    <div className="meedu-main-body">
      <BackBartment title="团列表详情" />
      <div className="float-left">
        <div className="float-left mt-30 mb-30">已支付团员：</div>
        <div className="float-left">
          <Table
            loading={loading}
            columns={columns}
            dataSource={users[1]}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
        <div className="float-left mt-30 mb-30">未支付团员：</div>
        <div className="float-left">
          <Table
            loading={loading}
            columns={columns}
            dataSource={users[0]}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TuangouTuanDetailPage;
