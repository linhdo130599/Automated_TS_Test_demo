import React from "react";
import axios from "../config/axiosConfig";
// var html = "<h1>Hello, world!</h1>";

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.getIndexHtlm();
  }
  state = {
    html: "<h1>Hello, world!</h1>",
    rootHtmlPath: "",
  };

  getIndexHtlm = () => {
    console.log("rendet html...");
    let path =
      "D:/tsgen/1590168991355-simple-test/simple-test/coverage/lcov-report/index.html";
    axios.post("/content", { path: path }, {}).then((res) => {
      console.log(res.data.content);
      this.setState({ html: res.data.content });
    });
  };
  render() {
    return React.createElement("h1", {
      dangerouslySetInnerHTML: {
        __html: this.state.html,
      },
    });
  }
}

export default Report;
