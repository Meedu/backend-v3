import React, { useState, useEffect } from "react";
import { InputNumber } from "antd";

interface PropInterface {
  value: any;
  disabled: boolean;
  onChange: (value: number) => void;
}

export const InputDuration = (props: PropInterface) => {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);

  useEffect(() => {
    if (props.value) {
      let value = Number(props.value);
      let hour: number = Math.floor(value / 3600);
      let minute: number = Math.floor((value - hour * 3600) / 60);
      let second: number = value - hour * 3600 - minute * 60;
      setHour(hour);
      setMinute(minute);
      setSecond(second);
    }
  }, [props.value]);

  useEffect(() => {
    let result = null;
    if (!(hour === 0 && minute === 0 && second === 0)) {
      result = hour * 3600 + minute * 60 + second;
      props.onChange(result);
    }
  }, [hour, minute, second]);

  const onHourChange = (value: number | null) => {
    if (value !== null) {
      setHour(value);
    }
  };

  const onMinuteChange = (value: number | null) => {
    if (value !== null) {
      setMinute(value);
    }
  };

  const onSecondChange = (value: number | null) => {
    if (value !== null) {
      setSecond(value);
    }
  };

  return (
    <div className="d-flex">
      <div>
        <InputNumber
          disabled={props.disabled}
          value={hour}
          onChange={onHourChange}
          min={0}
        ></InputNumber>
      </div>
      <div className="mx-10">
        <div className="helper-text">时</div>
      </div>
      <div>
        <InputNumber
          disabled={props.disabled}
          value={minute}
          onChange={onMinuteChange}
          min={0}
          max={59}
        ></InputNumber>
      </div>
      <div className="mx-10">
        <div className="helper-text">分</div>
      </div>
      <div>
        <InputNumber
          disabled={props.disabled}
          value={second}
          min={0}
          max={59}
          onChange={onSecondChange}
        ></InputNumber>
      </div>
      <div className="mx-10">
        <div className="helper-text">秒</div>
      </div>
    </div>
  );
};
