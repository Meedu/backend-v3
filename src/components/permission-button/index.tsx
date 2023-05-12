import { Button } from "antd";
import { useSelector } from "react-redux";

interface PropInterface {
  type: "link" | "text" | "primary" | "default";
  text: string;
  p: string;
  class: string;
  icon: any;
  onClick: () => void;
  disabled: any;
}

export const PerButton = (props: PropInterface) => {
  const user = useSelector((state: any) => state.loginUser.value.user);
  const isThrough = () => {
    if (!user.permissions) {
      return false;
    }
    return typeof user.permissions[props.p] !== "undefined";
  };
  return (
    <>
      {isThrough() && props.type === "link" && (
        <Button
          size="small"
          className={props.class}
          type="link"
          icon={props.icon}
          onClick={() => {
            props.onClick();
          }}
          disabled={props.disabled}
        >
          {props.text}
        </Button>
      )}
      {isThrough() && props.type !== "link" && (
        <Button
          className={props.class}
          type={props.type}
          icon={props.icon}
          onClick={() => {
            props.onClick();
          }}
          disabled={props.disabled}
        >
          {props.text}
        </Button>
      )}
    </>
  );
};
