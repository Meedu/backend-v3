import { useState, useEffect } from "react";
import { DurationText } from "../../../components";

interface PropInterface {
  value: number;
  type: string;
  total: number;
}

export const AniText = (props: PropInterface) => {
  const [result, setResult] = useState("rgba(4,200,119,0.2)");

  useEffect(() => {
    if (props.total > 0) {
      let opacity = props.value / props.total;
      if (opacity === 0) {
        setResult("rgba(4,200,119,0.2)");
      } else {
        if (opacity > 0.1) {
          setResult("rgba(4,200,119," + opacity.toFixed(2) + ")");
        }
      }
    }
  }, [props.value, props.total]);

  return (
    <>
      {props.type === "time" ? (
        <div style={{ color: result }}>
          <DurationText duration={props.value}></DurationText>
        </div>
      ) : (
        <span style={{ color: result }}>{props.value}</span>
      )}
    </>
  );
};
