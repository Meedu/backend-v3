import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { loginAction } from "../../store/user/loginUserSlice";
import {
  SystemConfigStoreInterface,
  saveConfigAction,
} from "../../store/system/systemConfigSlice";

import { setEnabledAddonsAction } from "../../store/enabledAddons/enabledAddonsConfigSlice";

interface Props {
  loginData?: any;
  configData?: any;
  addonsData?: any;
}

const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
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

    if (props.addonsData) {
      let enabledAddons: any = {};
      let count = 0;
      for (let i = 0; i < props.addonsData.length; i++) {
        if (props.addonsData[i].enabled) {
          count += 1;
          enabledAddons[props.addonsData[i].sign] = 1;
        }
      }
      dispatch(setEnabledAddonsAction({ addons: enabledAddons, count: count }));
    }
    setInit(true);
  }, [props]);

  return (
    <>
      {init && (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default InitPage;
