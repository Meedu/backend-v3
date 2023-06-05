import { useState, useEffect } from "react";

interface PropInterface {
  question: any;
}

export const QuestionRender = (props: PropInterface) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!props.question) {
      setTitle("");
      return;
    }
    let defaultTypes: any = {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
    };
    if (defaultTypes[props.question.type]) {
      setTitle(props.question.content);
      return;
    }
    let content = JSON.parse(props.question.content);
    setTitle(content.header);
  }, [props.question]);

  return (
    <div
      className="question-list-render"
      dangerouslySetInnerHTML={{
        __html: title.length > 130 ? title.slice(0, 130) + "..." : title,
      }}
    ></div>
  );
};
