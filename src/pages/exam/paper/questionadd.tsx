import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Select } from "antd";
import { useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { paper } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, QuestionRender } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const PaperQuestionCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [category_id, setCategoryId] = useState([]);
  const [categories, setCategories] = useState<any>([]);
  const [type, setType] = useState([]);
  const [types, setTypes] = useState<any>([]);
  const [level, setLevel] = useState([]);
  const [levels, setLevels] = useState<any>([]);

  useEffect(() => {
    document.title = "新建试题";
    dispatch(titleAction("新建试题"));
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
    paper
      .questionList(id, {
        id: id,
        page: page,
        size: size,
        in: 0,
        category_id: category_id,
        type: type,
        level: level,
      })
      .then((res: any) => {
        setList(res.data.questions.data);
        setTotal(res.data.questions.total);
        let box1: any = [];
        res.data.categories.length > 0 &&
          res.data.categories.map((item: any) => {
            box1.push({
              label: item.name,
              value: item.id,
            });
          });
        setCategories(box1);
        let box2: any = [];
        res.data.types.length > 0 &&
          res.data.types.map((item: any) => {
            box2.push({
              label: item.name,
              value: item.id,
            });
          });
        setTypes(box2);
        let box3: any = [];
        res.data.levels.length > 0 &&
          res.data.levels.map((item: any) => {
            box3.push({
              label: item.name,
              value: item.id,
            });
          });
        setLevels(box3);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetList = () => {
    setPage(1);
    setSize(20);
    setList([]);
    setType([]);
    setCategoryId([]);
    setLevel([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "试题ID",
      width: 150,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "分类",
      width: 200,
      render: (_, record: any) => <span>{record?.category?.name || '-'}</span>,
    },
    {
      title: "类型",
      width: 200,
      render: (_, record: any) => <span>{record.type_text}</span>,
    },
    {
      title: "难度",
      width: 200,
      render: (_, record: any) => <span>{record.level_text}</span>,
    },
    {
      title: "分数",
      width: 150,
      render: (_, record: any) => <span>{record.score}</span>,
    },
    {
      title: "内容",
      render: (_, record: any) => (
        <QuestionRender question={record}></QuestionRender>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const addmulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认添加选中试题？",
      centered: true,
      okText: "确认添加",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        paper
          .questionStoreMulti(id, {
            s: selectedRowKeys,
          })
          .then((res: any) => {
            message.success(res.message);
            resetData();
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建试题" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <Button type="primary" onClick={() => addmulti()}>
            批量添加
          </Button>
        </div>
        <div className="d-flex">
          <Select
            style={{ width: 150 }}
            value={category_id}
            onChange={(e) => {
              setCategoryId(e);
            }}
            allowClear
            placeholder="分类"
            options={categories}
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={type}
            onChange={(e) => {
              setType(e);
            }}
            allowClear
            placeholder="类型"
            options={types}
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={level}
            onChange={(e) => {
              setLevel(e);
            }}
            allowClear
            placeholder="难度"
            options={levels}
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
      <div className="float-left mb-30 check-num">
        已选择{selectedRowKeys.length}项
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

export default PaperQuestionCreatePage;
