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
      system: {
        logo: props.configData.system.logo,
        url: {
          api: props.configData.system.url.api,
          h5: props.configData.system.url.h5,
          pc: props.configData.system.url.pc,
        },
      },
      video: {
        default_service: props.configData.video.default_service,
      },
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
