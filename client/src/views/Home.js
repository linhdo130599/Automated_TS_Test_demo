import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import ReactJson from "react-json-view";

function Home() {
  const [data, setData] = useState();
  const [testcases, setTestcases] = useState();

  const getDataFromExplorer = (_data) => {
    setData(_data);
  };

  return (
    <div>
      {/* <NavBar /> */}
      <Row>
        <Col
          lg={2}
          style={{
            "border-right": "1px solid #00000020",
            "overflow-x": "auto",
          }}
        >
          <FileExplorer
            setData={getDataFromExplorer}
            setTestcases={setTestcases}
          />
        </Col>
        <Col lg={6}>
          <CodeEditor data={data} />
        </Col>

        <Col lg={4}>
          <ReactJson src={testcases} name="Testcases" />
        </Col>
      </Row>
    </div>
  );
}

// class Home extends Component{
//
//   render() {
//     return (
//       <div>
//         <NavBar />
//         <Container>
//           <Row>
//             <Col lg={2} >
//               <FileExplorer />
//             </Col>
//             <Col lg={5}>
//               <CodeEditor />
//             </Col>
//
//             <Col lg={5}>
//               Test File
//             </Col>
//           </Row>
//         </Container>
//       </div>
//   )}
// }

export default Home;
