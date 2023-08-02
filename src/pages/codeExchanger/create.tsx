import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, DatePicker, Table, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { codeExchanger } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  BackBartment,
  SelectResourcesMulti,
  PerButton,
  ThumbBar,
} from "../../components";
import moment from "moment";
import paperIcon from "../../assets/img/default-paper.png";
import vipIcon from "../../assets/img/default-vip.png";

interface DataType {
  id: React.Key;
}

const CodeExchangerCreatePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [coursesData, setCoursesData] = useState<any>([]);
  const [showSelectResourceCoursesWin, setShowSelectResourceCoursesWin] =
    useState<boolean>(false);
  const [coursesVodId, setCoursesVodId] = useState<any>([]);
  const [coursesLiveId, setCoursesLiveId] = useState<any>([]);
  const [bookId, setBookId] = useState<any>([]);
  const [paperId, setPaperId] = useState<any>([]);
  const [mockPaperId, setMockPaperId] = useState<any>([]);
  const [practiceId, setPracticeId] = useState<any>([]);
  const [vipId, setVipId] = useState<any>([]);

  useEffect(() => {
    document.title = "新建兑换活动";
    dispatch(titleAction("新建兑换活动"));
  }, []);

  useEffect(() => {
    let params: any = [];
    let liveParams: any = [];
    let paperParams: any = [];
    let bookParams: any = [];
    let mockPaperParams: any = [];
    let practiceParams: any = [];
    let vipParams: any = [];
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
        } else if (coursesData[i].type === "mock_paper") {
          mockPaperParams.push(coursesData[i].id);
        } else if (coursesData[i].type === "practice") {
          practiceParams.push(coursesData[i].id);
        } else if (coursesData[i].type === "vip") {
          vipParams.push(coursesData[i].id);
        }
      }
    }
    setCoursesVodId(params);
    setCoursesLiveId(liveParams);
    setPaperId(paperParams);
    setBookId(bookParams);
    setMockPaperId(mockPaperParams);
    setPracticeId(practiceParams);
    setVipId(vipParams);
  }, [coursesData]);

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (coursesData.length === 0) {
      message.warning("请添加兑换活动包含商品");
      return;
    }
    let params = [];
    if (coursesData.length > 0) {
      for (let i = 0; i < coursesData.length; i++) {
        let type = coursesData[i].type;
        let item = {
          sign: type,
          id: coursesData[i].id,
          name: coursesData[i].title,
          thumb: coursesData[i].thumb,
          charge: coursesData[i].charge,
        };
        params.push(item);
      }
    }
    setLoading(true);
    values.relate_data = JSON.stringify(params);
    values.start_at = moment(new Date(values.start_at)).format(
      "YYYY-MM-DD HH:mm"
    );
    values.end_at = moment(new Date(values.end_at)).format("YYYY-MM-DD HH:mm");
    codeExchanger
      .store(values)
      .then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        navigate(-1);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const changeCourses = (data: any) => {
    if (data[0].type === "vip") {
      if (coursesData.length > 0) {
        let box = [...coursesData];
        for (let i = 0; i < coursesData.length; i++) {
          if (coursesData[i].type === "vip") {
            box.splice(i, 1);
            message.warning("VIP会员只能选择一个，已自动删除之前选择的VIP会员");
          }
        }
        box = box.concat(data);
        setCoursesData(box);
      } else {
        let box = [...coursesData];
        box = box.concat(data);
        setCoursesData(box);
      }
    } else {
      let box = [...coursesData];
      box = box.concat(data);
      setCoursesData(box);
    }
    setShowSelectResourceCoursesWin(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "包含商品",
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
          ) : record.type === "paper" ||
            record.type === "mock_paper" ||
            record.type === "practice" ? (
            <ThumbBar
              value={paperIcon}
              width={120}
              height={90}
              title={record.title}
              border={4}
            ></ThumbBar>
          ) : record.type === "vip" ? (
            <ThumbBar
              value={vipIcon}
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
      title: "商品类型",
      render: (_, record: any) => (
        <>
          {record.type === "vod" && <span>录播课程</span>}
          {record.type === "live" && <span>直播课程</span>}
          {record.type === "book" && <span>电子书</span>}
          {record.type === "paper" && <span>考试</span>}
          {record.type === "mock_paper" && <span>模拟卷</span>}
          {record.type === "practice" && <span>练习</span>}
          {record.type === "vip" && <span>VIP会员</span>}
        </>
      ),
    },
    {
      title: "单品价格",
      render: (_, record: any) => (
        <>
          {record.charge === 0 && <span>免费</span>}
          {record.charge !== 0 && <span>￥{record.charge}</span>}
        </>
      ),
    },
    {
      title: "操作",
      width: 100,
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.CodeExchanger.activity.update"
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="新建兑换活动" />
      <SelectResourcesMulti
        type={true}
        selectedVod={coursesVodId}
        selectedLive={coursesLiveId}
        selectedBook={bookId}
        selectedPaper={paperId}
        selectedMockPaper={mockPaperId}
        selectedPractice={practiceId}
        selectedVip={vipId}
        open={showSelectResourceCoursesWin}
        enabledResource={"vod,live,book,paper,mock_paper,practice,vip"}
        onCancel={() => setShowSelectResourceCoursesWin(false)}
        onSelected={(result: any) => {
          changeCourses(result);
        }}
      ></SelectResourcesMulti>
      <div className="float-left">
        <div className="from-title mt-30">兑换活动基本信息</div>
        <Form
          form={form}
          name="codeExchanger-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: "请输入活动名称!" }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入活动名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="活动开始时间"
            name="start_at"
            rules={[{ required: true, message: "请选择开始时间!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              style={{ width: 300 }}
              showTime
              placeholder="请选择开始时间"
            />
          </Form.Item>
          <Form.Item
            label="活动结束时间"
            name="end_at"
            rules={[{ required: true, message: "请选择结束时间!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              style={{ width: 300 }}
              showTime
              placeholder="请选择结束时间"
            />
          </Form.Item>
        </Form>
        <div className="from-title mt-30">兑换活动包含商品</div>
        <div className="float-left mb-30">
          <PerButton
            type="primary"
            text="添加商品"
            class=""
            icon={null}
            p="addons.CodeExchanger.activity.store"
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

export default CodeExchangerCreatePage;
