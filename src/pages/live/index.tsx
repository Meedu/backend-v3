import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  message,
  Input,
  Button,
  Space,
  Dropdown,
  Select,
  Drawer,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { live } from "../../api/index";
import { DownOutlined } from "@ant-design/icons";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, ThumbBar, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const LivePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [category_id, setCategoryId] = useState([]);
  const [teacher_id, setTeacherId] = useState([]);
  const [status, setStatus] = useState(-1);
  const [teachers, setTeachers] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  useEffect(() => {
    document.title = "直播课";
    dispatch(titleAction("直播课"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .list({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        keywords: keywords,
        category_id: category_id,
        teacher_id: teacher_id,
        status: status,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        let categories = res.data.categories;
        const box: any = [];
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].children.length > 0) {
            box.push({
              label: categories[i].name,
              value: categories[i].id,
            });
            let children = categories[i].children;
            for (let j = 0; j < children.length; j++) {
              children[j].name = "|----" + children[j].name;
              box.push({
                label: children[j].name,
                value: children[j].id,
              });
            }
          } else {
            box.push({
              label: categories[i].name,
              value: categories[i].id,
            });
          }
        }
        setCategories(box);
        let statusList = res.data.statusList;
        const box2: any = [];
        for (let i = 0; i < statusList.length; i++) {
          box2.push({
            label: statusList[i].name,
            value: statusList[i].key,
          });
        }
        setStatusList(box2);
        let teachers = res.data.teachers;
        const box3: any = [];
        for (let i = 0; i < teachers.length; i++) {
          box2.push({
            label: teachers[i].name,
            value: teachers[i].id,
          });
        }
        setTeachers(box3);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setKeywords("");
    setStatus(-1);
    setCategoryId([]);
    setTeacherId([]);
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

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建直播课"
            class=""
            icon={null}
            p="addons.Zhibo.course.store"
            onClick={() => navigate("/live/course/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="直播课分类"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.course_category.list"
            onClick={() => navigate("/live/course/category/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="讲师管理"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.teacher.list"
            onClick={() => navigate("/live/teacher/index")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="课程评论"
            class="ml-10"
            icon={null}
            p="addons.Zhibo.course_comment"
            onClick={() => navigate("/live/course/comment")}
            disabled={null}
          />
          <OptionBar
            text="直播服务配置"
            value="/system/liveConfig?referer=%2Flive%2Fcourse%2Findex"
          ></OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="课程名称关键字"
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
              setDrawer(false);
            }}
          >
            筛选
          </Button>
          <div
            className="drawerMore d-flex ml-10"
            onClick={() => setDrawer(true)}
          >
            {showStatus && (
              <>
                <img src={filterHIcon} />
                <span className="act">已选</span>
              </>
            )}
            {!showStatus && (
              <>
                <img src={filterIcon} />
                <span>更多</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
