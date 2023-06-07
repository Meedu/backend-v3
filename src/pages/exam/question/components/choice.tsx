import React, { useState, useEffect } from "react";
import { QuestionQuillEditor } from "../../../../components";
import { Select, Button, Input } from "antd";

interface PropInterface {
  onChange: () => void;
}

export const QChoice: React.FC<PropInterface> = ({ onChange }) => {
  const [answers, setAnswers] = useState<any>([]);
  const [length, setLength] = useState(4);
  const [form, setForm] = useState<any>({
    score: null,
    content: null,
    answer: null,
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    option5: null,
    option6: null,
    option7: null,
    option8: null,
    option9: null,
    option10: null,
    remark: null,
  });

  useEffect(() => {
    let rows = [];
    for (let i = 0; i < length; i++) {
      rows.push({
        label: "选项" + (i + 1),
        value: "option" + (i + 1),
      });
    }
    setAnswers(rows);
  }, [length]);

  return <div className="float-left"></div>;
};
