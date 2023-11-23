import { useState } from "react";
import { useParams } from "react-router-dom";
import { SearchCli } from "../../../../../wailsjs/go/main/App";
import { classNames } from "../../../../helper/utils";
import { CliMsg, ICli } from "../../../../types";
import Style from "./index.module.css";

export default function Cli() {
  const { identity } = useParams();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<CliMsg[]>([
    { text: "123", type: "success" },
    { text: "err", type: "error" },
  ]);

  function handClick(e: any) {
    // console.log("鼠标点击:", e);
  }
  // 键盘按下
  function handKeyDown(e: any) {
    if (e.keyCode == 13) {
      if (text.trim() == "clear") {
        setMsg([]);
        setText("");
        return;
      }
      handSend(text);
    }
  }
  // 先后台发送消息
  function handSend(str: string) {
    const cli = str.split(" ");
    const prop = { conn_identity: identity, cli } as ICli;

    SearchCli(prop).then((res) => {
      if (res.code == 200) {
        // 返回结果为数组
        if (Array.isArray(res.data)) {
          setMsg((m) => [
            ...m,
            { type: "success", text: "> " + text },
            ...res.data?.map((item: any, index: number) => ({
              type: "success",
              text: `${index}）"${item}"`,
            })),
          ]);
        } else {
          // 返回结果为字符串
          setMsg((m) => [
            ...m,
            { type: "success", text: "> " + text },
            { type: "success", text: `"${res.data}"` },
          ]);
        }
      } else {
        setMsg((m) => [
          ...m,
          { type: "success", text: "> " + text },
          { type: "error", text: `"${res.data}"` },
        ]);
      }
      setText("");

      console.log("res.data", res);
    });
  }
  // 文本改变
  function handChange(e: any) {
    const val = e.target.value;
    // 回车作为发送指令操作不计入文本
    if (val.includes("\n")) {
      return;
    }
    setText(val);
  }
  return (
    <div className="w-full h-full overflow-scroll">
      {msg.map((item, index) => (
        <div
          key={index}
          className={classNames(
            "p-[4px]",
            item.type == "error" ? " text-[red]" : ""
          )}
        >
          {item.text}
        </div>
      ))}
      {/* <input className={Style.emptyInput} /> */}
      <div className={classNames(Style.inputText)}>
        <textarea
          className={Style.emptyInput}
          onKeyDownCapture={handKeyDown}
          onClick={handClick}
          onChange={handChange}
          value={text}
        ></textarea>
        <span style={{ lineHeight: "24px", marginLeft: "4px" }}> &gt; </span>
      </div>
    </div>
  );
}