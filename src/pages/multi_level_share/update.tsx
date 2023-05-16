import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";
import { UploadImageButton } from "../../components";

const MultiShareUpdatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    document.title = "编辑分销课程";
    dispatch(titleAction("编辑分销课程"));
  }, []);

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑分销课程" />
      <UploadImageButton
        text="上传图片"
        onSelected={(url) => {
          console.log(url);
        }}
      ></UploadImageButton>
    </div>
  );
};

export default MultiShareUpdatePage;
