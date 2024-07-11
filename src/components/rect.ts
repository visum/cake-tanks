import { Component } from "../world";

export interface Rect extends Component {
  type: "rect";
  values: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
