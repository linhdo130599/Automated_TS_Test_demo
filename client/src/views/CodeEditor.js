import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true,

    };
    return (
      <MonacoEditor
        width="100%"
        height="600"
        language="typescript"
        theme="vs"
        value={this.props.data}
        options={options}
        onChange={() => this.onChange}
        editorDidMount={() => this.editorDidMount}
      />
    );
  }
}

export default CodeEditor;
