import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { question } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { QuestionRender, PerButton } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PaperDetailDialog } from "../components/paper-detail";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const QuestionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [category_id, setCategoryId] = useState([]);
  const [categories, setCategories] = useState<any>([]);
  const [type, setType] = useState([]);
  const [types, setTypes] = useState<any>([]);
  const [level, setLevel] = useState([]);
  const [levels, setLevels] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [successTotal, setSuccessTotal] = useState(0);
  const [failureTotal, setFailureTotal] = useState(0);
  const [visiable, setVisiable] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [failureResult, setFailureResult] = useState<any>(null);

  useEffect(() => {
    document.title = "题库";
    dispatch(titleAction("题库"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    question
      .list({
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
      title: "分类",
      width: 200,
      render: (_, record: any) => <span>{record?.category?.name || "-"}</span>,
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
      title: "内容",
      render: (_, record: any) => (
        <QuestionRender question={record}></QuestionRender>
      ),
    },
    {
      title: "操作",
      width: 120,
      fixed: "right",
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="编辑"
          class="c-primary"
          icon={null}
          p="addons.Paper.question.update"
          onClick={() => {
            navigate("/exam/question/update?id=" + record.id);
          }}
          disabled={null}
        />
      ),
    },
  ];

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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中试题？",
      centered: true,
      okText: "确认删除",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        question
          .destroyMulti({
            ids: selectedRowKeys,
          })
          .then((res: any) => {
            if (res.data.failure.total > 0) {
              setSuccessTotal(res.data.success.total);
              setFailureTotal(res.data.failure.total);
              setLoading(false);
              setFailureResult(res.data.failure.data);
              setVisiable(true);
              resetData();
            } else {
              setLoading(false);
              setFailureResult(null);
              message.success("成功");
              resetData();
            }
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

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建试题"
            class=""
            icon={null}
            p="addons.Paper.question.store"
            onClick={() => navigate("/exam/question/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="试题分类"
            class="ml-10"
            icon={null}
            p="addons.Paper.question_category.list"
            onClick={() => navigate("/exam/question/category/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="试题批量导入"
            class="ml-10"
            icon={null}
            p="addons.Paper.question.import.csv"
            onClick={() => navigate("/exam/question/import")}
            disabled={null}
          />
          <PerButton
            type="danger"
            text="批量删除"
            class="ml-10"
            icon={null}
            p="addons.Paper.question.delete"
            onClick={() => destorymulti()}
            disabled={null}
          />
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
      {visiable ? (
        <Modal
          title=""
          onCancel={() => {
            setVisiable(false);
          }}
          cancelText="取消"
          okText="成卷详情"
          open={true}
          width={500}
          maskClosable={false}
          onOk={() => {
            setVisiable(false);
            setShowDialog(true);
          }}
          centered
        >
          <div className="pt-20 pb-10 text-center">
            <span>{successTotal}道试题删除成功，</span>
            <span className="c-red">{failureTotal}道试题删除失败(已成卷) </span>
          </div>
          <div className="pb-10 text-center">
            <span>已成卷试题请先在关联试卷/模拟试卷/练习中删除该试题！</span>
          </div>
        </Modal>
      ) : null}
      <PaperDetailDialog
        open={showDialog}
        onCancel={() => setShowDialog(false)}
        results={failureResult}
      ></PaperDetailDialog>
    </div>
  );
};
export default QuestionPage;
