import React, { useState, useEffect } from "react";
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
  FaFacebook,
  FaTimes,
} from "react-icons/fa";
import styled from "styled-components";
import last from "lodash/last";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20;
  // if (type === "file") paddingLeft += 20;
  // if (type === "function") paddingLeft += 20;
  return paddingLeft;
};

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${(props) => getPaddingLeft(props.level, props.type)}px;
  &:hover {
    background: lightgray;
  }
`;

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 5)}px;
`;

const getNodeLabel = (node) => last(node.path.split("/"));

const TreeNode = (props) => {
  const {
    node,
    getChildNodes,
    level,
    onToggle,
    onNodeSelect,
    onNodeChecked,
  } = props;
  // const [checked, setChecked] = useState(node.isSelected);

  // useEffect(() => {
  //   setChecked(node.isSelected);
  // }, [node.isSelected]);

  const onChecked = (e) => {
    const checkedValue = e.target.checked;
    console.log("Check Value", checkedValue);
    node.isSelected = checkedValue;
    // if (node.type === "function") {
    //   setChecked(checkedValue);
    // } else {
    //   setChecked(checkedValue);
    // }
    // setChecked(checkedValue);
    onNodeChecked(node);
    // onNodeChecked()
  };

  // const onFolderChecked = (e) => {
  //   const folderCheck = e.target.checked;
  //   node.isSelected = folderCheck;
  //   const children = getChildNodes;
  //   const updateChildren = children.map((child) => {

  //   })

  // }

  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type}>
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === "folder" &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
          {
            node.type === "file" &&
              (node.isOpen && node.children ? (
                <FaChevronDown />
              ) : node.children ? (
                <FaChevronRight />
              ) : null)
            // <div className={"invisible"}>
            //   <FaTimes />
            // </div>
          }
        </NodeIcon>
        <NodeIcon>
          <div className="d-flex justify-content-right text-center">
            <Form.Check
              type="checkbox"
              id={node.path}
              arial-label={node.path}
              checked={node.isSelected}
              onChange={(e) => onChecked(e)}
            />
          </div>
        </NodeIcon>

        {/*{node.type === "function" && (*/}
        {/*  <Form.Group controlId={node.path}>*/}
        {/*    <Form.Check type="checkbox"/>*/}
        {/*  </Form.Group>*/}
        {/*)}*/}

        <NodeIcon marginRight={10}>
          {node.type === "file" && <FaFile />}
          {node.type === "folder" && node.isOpen === true && <FaFolderOpen />}
          {node.type === "folder" && !node.isOpen && <FaFolder />}
          {node.type === "function" && <FaFacebook />}
          {/* {node.type === "function" && (
            <div className="d-flex justify-content-right">
              <Form.Check
                type="checkbox"
                id={node.path}
                arial-label={node.path}
                checked={node.isSelected}
                onChange={(e) => onChecked(e)}
              />
            </div>
          )} */}
        </NodeIcon>

        <span role="button" onClick={() => onNodeSelect(node)}>
          {getNodeLabel(node)}
        </span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node).map((childNode) => (
          <TreeNode
            key={childNode.path}
            {...props}
            node={childNode}
            level={level + 1}
          />
        ))}
    </React.Fragment>
  );
};

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
};

TreeNode.defaultProps = {
  level: 0,
};

export default TreeNode;
