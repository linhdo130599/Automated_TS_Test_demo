import React, { Component } from "react";
import styled from "styled-components";
import Tree from "./Tree";
import AppContext from "../contexts/AppContext";
import { Redirect } from "react-router-dom";
import axios from "../config/axiosConfig";

const StyledFileExplorer = styled.div`
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
`;

const TreeWrapper = styled.div`
  width: 100%;
`;

export default class FileExplorer extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedFile: null,
  };

  onSelect = (file) => {
    // console.log(file)
    this.setState({ selectedFile: file });
    this.getFileContent(file.path);
    // this.props.setData(file.content);
  };

  getFileContent = (path) => {
    axios.post("/content", { path: path }, {}).then((res) => {
      // console.log(res.data.content);
      this.props.setData(res.data.content);
    });
  };

  onFunctionSelect = (functionNode) => {
    if (functionNode) {
      axios.post("/testcases", { path: functionNode.path }, {}).then((res) => {
        // console.log(res.data.content);
        this.props.setTestcases(res.data.testcases);
      });
    }
  };

  render() {
    return (
      <AppContext.Consumer>
        {(context) => {
          // console.log(context);
          const { nodes, tsConfigPath, srcPath, rootPath } = context;
          if (!nodes) {
            return <Redirect to="/upload" />;
          } else {
            return (
              <StyledFileExplorer>
                <TreeWrapper>
                  <Tree
                    onSelect={this.onSelect}
                    // onTestFileSelect={this.onTestFileSelect}
                    nodes={nodes}
                    tsConfigPath={tsConfigPath}
                    srcPath={srcPath}
                    rootPath={rootPath}
                    onFunctionSelect={this.onFunctionSelect}
                  />
                </TreeWrapper>
              </StyledFileExplorer>
            );
          }
        }}
      </AppContext.Consumer>
    );
  }
}
