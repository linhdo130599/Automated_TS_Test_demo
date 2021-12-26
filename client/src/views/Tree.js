import React from "react";
import values from "lodash/values";
import PropsType from "prop-types";
import TreeNode from "./TreeNode";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import axios from "../config/axiosConfig";
import { Ellipsis } from "react-awesome-spinners";

class Tree extends React.Component {
  state = {
    nodes: {},
    loading: false,
    runTestLoading: false,
    reportPath: "",
    haveReport: false,
  };

  componentDidMount() {
    this.getNodes();
  }

  getNodes = () => {
    // axios.get('http://blabla.xyz').then(data => {{nodes: data}})
    // this.setState({ nodes: data });
    this.setState({ nodes: this.props.nodes });
  };

  getRootNodes = () => {
    const { nodes } = this.state;
    return values(nodes).filter((node) => node.isRoot === true);
  };

  getChildNodes = (node) => {
    const { nodes } = this.state;
    if (!node.children) return [];
    return node.children.map((path) => nodes[path]);
  };

  onToggle = (node) => {
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    this.setState({ nodes });
  };

  onNodeSelect = (node) => {
    const { onSelect, onFunctionSelect } = this.props;
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    this.setState({ nodes });
    if (node.type === "file") {
      onSelect(node);
    } else if (node.type === "function") {
      onFunctionSelect(node);
    }
  };

  onNodeChecked = (node) => {
    console.log("Tick file!!!");
    // const { onNodeChecked } = this.props;
    const { nodes } = this.state;
    console.log("Checked Node:", nodes[node.path]);
    if (node.children) {
      node.children.forEach((element) => {
        console.log("FunctionNode", nodes[element]);
        // nodes[element].isSelected = node.isSelected;
        nodes[element].isSelected = node.isSelected;
        if (nodes[element].type === "folder") {
          this.onNodeChecked(nodes[element]);
        }
        if (nodes[element].type === "file") {
          this.onNodeChecked(nodes[element]);
        }
        // if (nodes[element].type === "file") {
        //   nodes[element].isSelected = true;
        //   this.onNodeChecked(element);
        // }
        // if (nodes[element].type === "function") {
        //   console.log("funtion tick:", element);
        //   console.log("Funtion", nodes[element]);
        //   nodes[element].isSelected = true;
        // }
      });
    }
    this.setState({ nodes });
  };

  onRunningTestClick = () => {
    console.log("Running test click");
    this.setState({ runTestLoading: true });
    const { rootPath } = this.props;
    axios.post("/report", { rootPath: rootPath }).then((res) => {
      const reportPath = res.data.reportPath;
      console.log(reportPath);
      this.setState({
        reportPath: reportPath,
        runTestLoading: false,
        haveReport: true,
      });
    });
  };

  onGenerateClick = () => {
    let checkedFunction = Object.keys(this.state.nodes).filter(
      (item) =>
        this.state.nodes[item].type === "function" &&
        this.state.nodes[item].isSelected
    );
    let functions = checkedFunction.map((item) => this.state.nodes[item].path);
    console.log("Generate Click");
    this.setState({ loading: true });
    const { tsConfigPath, srcPath, rootPath } = this.props;
    console.log("srcPath: ", srcPath);
    axios
      .post(`/generate`, {
        functions: functions,
        tsConfigPath: tsConfigPath,
        srcPath: srcPath,
        rootPath: rootPath,
      })
      .then((res) => {
        // console.log(res.data);
        const nodes = res.data.files;
        this.setState({ loading: false, nodes: nodes });
      })
      .catch((error) => console.log(error));
  };

  render() {
    const rootNodes = this.getRootNodes();
    const { loading, runTestLoading } = this.state;
    return (
      <div>
        {rootNodes.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            getChildNodes={this.getChildNodes}
            onToggle={this.onToggle}
            onNodeSelect={this.onNodeSelect}
            onNodeChecked={this.onNodeChecked}
          />
        ))}
        <Row className={"mt-5 d-flex justify-content-center"}>
          {loading ? (
            <Ellipsis color="#28a745" />
          ) : (
            <Button
              className="col-8"
              variant="outline-success"
              onClick={() => this.onGenerateClick()}
            >
              Generate
            </Button>
          )}
        </Row>
        <Row className={"mt-5 d-flex justify-content-center"}>
          {runTestLoading ? (
            <Ellipsis color="#28a745" />
          ) : (
            <Button
              className="col-8"
              variant="outline-primary"
              onClick={() => this.onRunningTestClick()}
            >
              Run test script
            </Button>
          )}
        </Row>
        {this.state.haveReport ? (
          <Row className={"mt-5 d-flex justify-content-center"}>
            <a href={this.state.reportPath} target={"_blank"}>
              Click here for reports
            </a>
          </Row>
        ) : null}
      </div>
    );
  }
}

Tree.propTypes = {
  onSelect: PropsType.func.isRequired,
};

export default Tree;
