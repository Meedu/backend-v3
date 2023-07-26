import { useEffect, useState } from "react";
import { Form, Input, message, Button, Table, Space, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { path } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import {
  HelperText,
  SelectResourcesMulti,
  PerButton,
  BackBartment,
  ThumbBar,
} from "../../../components";
import paperIcon from "../../../assets/img/default-paper.png";

interface DataType {
  id: React.Key;
}

const LearnPathStepUpdatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const result = new URLSearchParams(useLocation().search);
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [coursesData, setCoursesData] = useState<any>([]);
  const [showSelectResourceCoursesWin, setShowSelectResourceCoursesWin] =
    useState<boolean>(false);
  const [coursesVodId, setCoursesVodId] = useState<any>([]);
  const [coursesLiveId, setCoursesLiveId] = useState<any>([]);
  const [bookId, setBookId] = useState<any>([]);
  const [paperId, setPaperId] = useState<any>([]);
  const [practiceId, setPracticeId] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));
  const [path_id, setPathId] = useState(Number(result.get("path_id")));

  useEffect(() => {
    document.title = "编辑学习步骤";
    dispatch(titleAction("编辑学习步骤"));
    initData();
  }, [id, path_id]);

  useEffect(() => {
    setId(Number(result.get("id")));
    setPathId(Number(result.get("path_id")));
    getDetail();
  }, [result.get("id"), result.get("path_id")]);

  useEffect(() => {
    let params: any = [];
    let liveParams: any = [];
    let paperParams: any = [];
    let bookParams: any = [];
    let practiceParams: any = [];
    if (coursesData.length > 0) {
      for (let i = 0; i < coursesData.length; i++) {
        if (coursesData[i].type === "vod") {
          params.push(coursesData[i].id);
        } else if (coursesData[i].type === "live") {
          liveParams.push(coursesData[i].id);
        } else if (coursesData[i].type === "paper") {
          paperParams.push(coursesData[i].id);
        } else if (coursesData[i].type === "book") {
          bookParams.push(coursesData[i].id);
        } else if (coursesData[i].type === "practice") {
          practiceParams.push(coursesData[i].id);
        }
      }
    }
    setCoursesVodId(params);
    setCoursesLiveId(liveParams);
    setPaperId(paperParams);
    setBookId(bookParams);
    setPracticeId(practiceParams);
  }, [coursesData]);

  const initData = async () => {
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    if (id === 0) {
      return;
    }
    const res: any = await path.stepDetail(id);
    var data = res.data;
    form.setFieldsValue({
      name: data.step.name,
      sort: data.step.sort,
      desc: data.step.desc,
    });
    let courses = data.courses;
    let params = [];
    if (courses.length > 0) {
      for (let i = 0; i < courses.length; i++) {
        let type = courses[i].type;
        if (type === "course") {
          type = "vod";
        }
        if (type === "paper_practice") {
          type = "practice";
        }
        if (type === "paper_paper") {
          type = "paper";
        }
        let item = {
          type: type,
          id: courses[i].other_id,
          title: courses[i].name,
          thumb: courses[i].thumb,
          charge: courses[i].charge,
        };
        params.push(item);
      }
    }
    setCoursesData(params);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    let params = [];
    if (coursesData.length > 0) {
      for (let i = 0; i < coursesData.length; i++) {
        let type = coursesData[i].type;
        if (type === "vod") {
          type = "course";
        }
        if (type === "practice") {
          type = "paper_practice";
        }
        if (type === "paper") {
          type = "paper_paper";
        }
        let item = {
          type: type,
          other_id: coursesData[i].id,
          name: coursesData[i].title,
          thumb: coursesData[i].thumb,
          charge: coursesData[i].charge,
        };
        params.push(item);
      }
    }
    setLoading(true);
    values.path_id = path_id;
    values.courses = params;
    path
      .stepUpdate(id, values)
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        navigate(-1);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "关联课程",
      width: "53%",
      render: (_, record: any) => (
        <>
          {record.type === "book" ? (
            <ThumbBar
              value={record.thumb}
              width={90}
              height={120}
              title={record.title}
              border={4}
            ></ThumbBar>
          ) : record.type === "paper" || record.type === "practice" ? (
            <ThumbBar
              value={paperIcon}
              width={120}
              height={90}
              title={record.title}
              border={4}
            ></ThumbBar>
          ) : (
            <ThumbBar
              value={record.thumb}
              width={120}
              height={90}
              title={record.title}
              border={4}
            ></ThumbBar>
          )}
        </>
      ),
    },
    {
      title: "课程类型",
      width: "20%",
      render: (_, record: any) => (
        <>
          {record.type === "vod" && <span>录播课程</span>}
          {record.type === "live" && <span>直播课程</span>}
          {record.type === "book" && <span>电子书</span>}
          {record.type === "paper" && <span>考试</span>}
          {record.type === "practice" && <span>练习</span>}
        </>
      ),
    },
    {
      title: "单品价格",
      width: "21%",
      render: (_, record: any) => (
        <>
          {record.charge === 0 && <span>免费</span>}
          {record.charge !== 0 && <span>￥{record.charge}</span>}
        </>
      ),
    },
    {
      title: "操作",
      width: "6%",
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.learnPaths.relation.update"
          onClick={() => {
            delCourses(record.id);
          }}
          disabled={null}
        />
      ),
    },
  ];

  const delCourses = (id: number) => {
    const data = [...coursesData];
    const index = data.findIndex((i: any) => i.id === id);
    if (index >= 0) {
      data.splice(index, 1);
    }
    if (data.length > 0) {
      setCoursesData(data);
    } else {
      setCoursesData([]);
    }
  };

  const changeCourses = (data: any) => {
    let box = [...coursesData];
    box = box.concat(data);
    setCoursesData(box);
    setShowSelectResourceCoursesWin(false);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑学习步骤" />
      <SelectResourcesMulti
        type={true}
        selectedVod={coursesVodId}
        selectedLive={coursesLiveId}
        selectedBook={bookId}
        selectedPaper={paperId}
        selectedMockPaper={[]}
        selectedPractice={practiceId}
        selectedVip={[]}
        open={showSelectResourceCoursesWin}
        enabledResource={"vod,live,book,paper,practice"}
        onCancel={() => setShowSelectResourceCoursesWin(false)}
        onSelected={(result: any) => {
          changeCourses(result);
        }}
      ></SelectResourcesMulti>
      {init && (
        <div className="float-left text-center mt-30">
          <Spin></Spin>
        </div>
      )}
      <div style={{ display: init ? "none" : "block" }} className="float-left">
        <div className="from-title mt-30">学习步骤基本信息</div>
        <Form
          form={form}
          name="learnPath-step-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: "填输入排序!" }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="sort"
                rules={[{ required: true, message: "填输入排序!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="填输入整数"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。小数排在前，大数排在后。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="步骤名称"
            name="name"
            rules={[{ required: true, message: "请输入步骤名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入步骤名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="步骤简介"
            name="desc"
            rules={[{ required: true, message: "请输入步骤简介!" }]}
          >
            <Space align="baseline">
              <Form.Item
                name="desc"
                rules={[{ required: true, message: "填输入步骤简介!" }]}
              >
                <Input.TextArea
                  style={{ width: 800 }}
                  placeholder="请输入步骤简介"
                  allowClear
                  rows={4}
                  maxLength={150}
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。小数排在前，大数排在后。"></HelperText>
              </div>
            </Space>
          </Form.Item>
        </Form>
        <div className="from-title mt-30">学习步骤关联课程</div>
        <div className="float-left mb-30">
          <PerButton
            type="primary"
            text="添加课程"
            class=""
            icon={null}
            p="addons.learnPaths.relation.store"
            onClick={() => setShowSelectResourceCoursesWin(true)}
            disabled={null}
          />
        </div>
        <div className="float-left">
          <Table
            loading={loading}
            columns={columns}
            dataSource={coursesData}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
        <div className="bottom-menus">
          <div className="bottom-menus-box">
            <div>
              <Button
                loading={loading}
                type="primary"
                onClick={() => form.submit()}
              >
                保存
              </Button>
            </div>
            <div className="ml-24">
              <Button type="default" onClick={() => navigate(-1)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPathStepUpdatePage;
