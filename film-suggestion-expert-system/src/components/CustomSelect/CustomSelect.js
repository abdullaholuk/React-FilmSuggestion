import React from "react";
import { SelectContainer, CustomSelectContainer } from "./CustomSelect.styled";

class CustomSelect extends React.Component {
  showValues = () => {
    return this.props.selectAll ? "---Select All---" : this.props.value;
  };

  render() {
    return (
      <CustomSelectContainer>
        <h3 className="title" align="center">{this.props.title}</h3>
        <SelectContainer
          onChange={this.props.onChange}
          mode={this.props.mode}
          allowClear={this.props.allowClear}
          value={this.showValues()}
          placeholder={this.props.placeholder}
        >
          {this.props.children}
        </SelectContainer>
      </CustomSelectContainer>
    );
  }
}

export default CustomSelect;
