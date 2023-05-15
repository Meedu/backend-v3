import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { stats } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { DayWeekMonth } from "../../../components/index";

const StatsMemberPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "学员数据";
    dispatch(titleAction("学员数据"));
  }, []);

  return <></>;
};

export default StatsMemberPage;
