import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Select } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { practice } from "../../../../api/index";
import { titleAction } from "../../../../store/user/loginUserSlice";
import { BackBartment, QuestionRender } from "../../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  type?: any;
  category_id?: any;
  level?: any;
}

const PracticeQuestionCreatePage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "20",
    type: "[]",
    category_id: "[]",
    level: "[]",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "20");
  const [category_id, setCategoryId] = useState(
    JSON.parse(searchParams.get("category_id") || "[]")
  );
  const [type, setType] = useState(
    JSON.parse(searchParams.get("type") || "[]")
  );
  const [level, setLevel] = useState(
    JSON.parse(searchParams.get("level") || "[]")
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  const [levels, setLevels] = useState<any>([]);

  useEffect(() => {
    document.title = "添加章节组卷";
    dispatch(titleAction("添加章节组卷"));
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
      .questionCreate(id, {
        page: page,
        size: size,
        category_id: category_id,
        type: type,
        level: level,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
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

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.category_id !== "undefined") {
          prev.set("category_id", JSON.stringify(params.category_id));
        }
        if (typeof params.type !== "undefined") {
          prev.set("type", JSON.stringify(params.type));
        }
        if (typeof params.level !== "undefined") {
          prev.set("level", JSON.stringify(params.level));
        }
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

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 20,
      category_id: [],
      type: [],
      level: [],
    });
    setList([]);
    setType([]);
    setCategoryId([]);
    setLevel([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    resetLocalSearchParams({
      page: 1,
    });
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "分类",
      width: 200,
      render: (_, record: any) => <span>{record?.category?.name || "-"}</span>,
    },
    {
      title: "类型",
      width: 120,
      render: (_, record: any) => <span>{record.type_text}</span>,
    },
    {
      title: "难度",
      width: 120,
      render: (_, record: any) => <span>{record.level_text}</span>,
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
        practice
          .questionStoreMulti(id, {
            qids: selectedRowKeys,
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
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="添加章节组卷" />
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
              resetLocalSearchParams({
                page: 1,
                category_id:
                  typeof category_id !== "undefined" ? category_id : [],
                type: typeof type !== "undefined" ? type : [],
                level: typeof level !== "undefined" ? level : [],
              });
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

export default PracticeQuestionCreatePage;
