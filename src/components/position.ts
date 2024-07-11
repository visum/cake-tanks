import { Component } from "../world";

export interface Position extends Component {
  type: "position";
  values: {
    x: number;
    y: number;
    rotation: number;
  };
}
