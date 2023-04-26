import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { loginAction } from "../../store/user/loginUserSlice";
import {
  SystemConfigStoreInterface,
  saveConfigAction,
} from "../../store/system/systemConfigSlice";

interface Props {
  loginData?: any;
  configData?: any;
}

const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  if (props.loginData) {
    dispatch(loginAction(props.loginData));
  }

  if (props.configData) {
    let config: SystemConfigStoreInterface = {
      systemName: props.configData["system.name"],
      systemLogo: props.configData["system.logo"],
      systemApiUrl: props.configData["system.api_url"],
      systemPcUrl: props.configData["system.pc_url"],
      systemH5Url: props.configData["system.h5_url"],
      memberDefaultAvatar: props.configData["member.default_avatar"],
      courseDefaultThumbs: props.configData["default.course_thumbs"],
    };
    dispatch(saveConfigAction(config));
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default InitPage;
