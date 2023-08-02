import { useState, useEffect } from "react";
import { Modal, Table, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment, PerButton, QuestionRender } from "../../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { paper } from "../../../api/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  user_id: number;
}

const PaperQuestionPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>({});
  const [refresh, setRefresh] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [id, setId] = useState(Number(result.get("id")));
  const [arr1, setArr1] = useState<any>([]);
  const [arr2, setArr2] = useState<any>([]);
  const [arr3, setArr3] = useState<any>([]);
  const [arr4, setArr4] = useState<any>([]);
  const [arr5, setArr5] = useState<any>([]);
  const [arr6, setArr6] = useState<any>([]);

  useEffect(() => {
    document.title = "组卷";
    dispatch(titleAction("组卷"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, refresh]);

  useEffect(() => {
    let score = 0;
    for (let index in list) {
      let data = list[index];
      for (let i = 0; i < data.length; i++) {
        score += data[i].score;
      }
    }
    setTotalScore(score);
  }, [list]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    paper
      .question(id, {
        id: id,
      })
      .then((res: any) => {
        let results = res.data.questions;
        let params = {};
        if (results["单选题"]) {
          Object.assign(params, { 单选题: results["单选题"] });
        }
        if (results["多选题"]) {
          Object.assign(params, { 多选题: results["多选题"] });
        }
        if (results["判断题"]) {
          Object.assign(params, { 判断题: results["判断题"] });
        }
        if (results["填空题"]) {
          Object.assign(params, { 填空题: results["填空题"] });
        }
        if (results["问答题"]) {
          Object.assign(params, { 问答题: results["问答题"] });
        }
        if (results["题帽题"]) {
          Object.assign(params, { 题帽题: results["题帽题"] });
        }
        setList(params);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "试题ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "分数",
      width: 150,
      render: (_, record: any) => <span>{record.score}分</span>,
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
      width: 100,
      fixed: "right",
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.Paper.paper.questions.delete"
          onClick={() => {
            destory(record.id);
          }}
          disabled={null}
        />
      ),
    },
  ];

  const destorymulti = () => {
    let selectedRowKeys: any = [
      ...arr1,
      ...arr2,
      ...arr3,
      ...arr4,
      ...arr5,
      ...arr6,
    ];

    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的试题？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        paper
          .questionDestoryMulti(id, { ids: selectedRowKeys })
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

  const destory = (qid: number) => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此试题？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        paper
          .questionDestroy(id, qid)
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
    setList([]);
    setArr1([]);
    setArr2([]);
    setArr3([]);
    setArr4([]);
    setArr5([]);
    setArr6([]);
    setRefresh(!refresh);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="组卷"></BackBartment>
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="primary"
          text="新建试题"
          class=""
          icon={null}
          p="addons.Paper.paper.questions.add"
          onClick={() => navigate("/exam/paper/questionadd?id=" + id)}
          disabled={null}
        />
        <PerButton
          type="danger"
          text="批量删除"
          class="ml-10"
          icon={null}
          p="addons.Paper.paper.questions.delete.batch"
          onClick={() => destorymulti()}
          disabled={null}
        />
      </div>
      <div className="float-left mb-30">
        <h2>{totalScore}分</h2>
      </div>
      <div className="float-left">
        {Object.keys(list).map((v: any, i: any) => (
          <div className="float-left mb-30" key={i}>
            <div className="float-left mb-10 question-helper-text">
              {v}&nbsp;(共{list[v].length}题)
            </div>
            <Table
              rowSelection={{
                type: "checkbox",
                selectedRowKeys:
                  i === 0
                    ? arr1
                    : i === 1
                    ? arr2
                    : i === 2
                    ? arr3
                    : i === 3
                    ? arr4
                    : i === 4
                    ? arr5
                    : arr6,
                onChange: (
                  selectedRowKeys: React.Key[],
                  selectedRows: DataType[]
                ) => {
                  if (i === 0) {
                    setArr1(selectedRowKeys);
                  } else if (i === 1) {
                    setArr2(selectedRowKeys);
                  } else if (i === 2) {
                    setArr3(selectedRowKeys);
                  } else if (i === 3) {
                    setArr4(selectedRowKeys);
                  } else if (i === 4) {
                    setArr5(selectedRowKeys);
                  } else if (i === 5) {
                    setArr6(selectedRowKeys);
                  }
                },
              }}
              loading={loading}
              columns={columns}
              dataSource={list[v]}
              rowKey={(record) => record.id}
              pagination={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperQuestionPage;
