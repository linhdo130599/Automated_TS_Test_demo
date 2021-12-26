import React, { useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { Redirect } from "react-router-dom";
import { Ellipsis } from "react-awesome-spinners";
import AppContext from "../contexts/AppContext";
import { Form } from "react-bootstrap";

function Upload() {
  const [state, updateState] = useState({
    file: null,
    redirect: false,
    loading: false,
    srcDir: "/src",
  });

  const { setNodes } = useContext(AppContext);
  const { setTsConfigPath } = useContext(AppContext);
  const { setSrcPath } = useContext(AppContext);
  const { setRootPath } = useContext(AppContext);

  const setState = (newState) => {
    updateState({
      ...state,
      ...newState,
    });
  };

  const onUploadClick = (e) => {
    console.log(state.file);
    setState({ loading: true });
    getImportResult();
  };

  const getImportResult = () => {
    const data = new FormData();
    data.append("file", state.file);
    data.append("srcDir", state.srcDir);
    axios({
      url: "/import",
      data: data,
      method: "post",
      config: { headers: { "Content-Type": "multipart/form-data" } },
    })
      // .post("/import", data, {
      //   // receive two parameter endpoint url ,form data
      //   headers: { "Content-Type": "multipart/form-data" },
      // })
      .then((res) => {
        // then print response status
        let nodes = res.data.files;
        console.log(nodes);
        setNodes(nodes);
        let tsConfigPath = res.data.tsConfigPath;
        setTsConfigPath(tsConfigPath);
        let srcPath = res.data.srcPath;
        setSrcPath(srcPath);
        let rootPath = res.data.rootPath;
        setRootPath(rootPath);
        setState({ redirect: true, loading: false });
      });
  };

  const renderRedirect = () => {
    if (state.redirect) {
      return <Redirect to="/playGround" />;
    }
  };

  const onChangeHandler = (e) => {
    switch (e.target.name) {
      // Updated this
      case "selectedFile":
        if (e.target.files.length > 0) {
          // Accessed .name from file
          setState({ file: e.target.files[0] });
        }
        break;
      default:
        setState({ [e.target.name]: e.target.value });
    }
  };
  // const onChangeHandler1 = (e) => {
  //   switch (e.target.name) {
  //     // Updated this
  //     case "selectedFile1":
  //       if (e.target.files.length > 0) {
  //         // Accessed .name from file
  //         setState({ file1: e.target.files[0] });
  //       }
  //       break;
  //     default:
  //       setState({ [e.target.name]: e.target.value });
  //   }
  // };

  const onSourceRootDirChange = (e) => {
    console.log(e.target.value);
    setState({ srcDir: e.target.value });
  };

  const { file,file1, loading, redirect, srcDir } = state;
  let fileName = null;
  // let fileName1 = null;
  fileName = file ? (
    <span>File Selected - {file.name}</span>
  ) : (
    <span>Choose a file...</span>
  );
  // fileName1 = file1 ? (
  //   <span>File Selected - {file1.name}</span>
  // ) : (
  //   <span>Choose a file...</span>
  // );
  return (
    <div id="login">
      <h3 className="text-center text-white pt-5">Login form</h3>
      <div className="container">
        <div
          id="login-row"
          className="row justify-content-center align-items-center"
        >
          <div id="login-column" className="col-md-6">
            <div id="login-box" className="col-md-12">
              <form id="login-form" className="form" action="" method="post">
                <h3 className="text-center text-info">Import Project</h3>
                <br />
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="customFile"
                    name="selectedFile"
                    onChange={onChangeHandler}
                    disabled={loading}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    {fileName}
                  </label>
                </div>
                {/* <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="customFile1"
                    name="selectedFile1"
                    onChange={onChangeHandler1}
                    disabled={loading}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    {fileName1}
                  </label>
                </div> */}
                <br />
                <br />
                <Form.Label>Source Root Directory</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="/calculator/ts/src"
                  onChange={onSourceRootDirChange}
                  value={srcDir}
                />
                <div className="d-flex justify-content-center">
                  {/* {renderRedirect()} */}
                  {loading ? (
                    <Ellipsis color="#17a2b8" />
                  ) : redirect ? (
                    renderRedirect()
                  ) : (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={onUploadClick}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
