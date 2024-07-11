import { Component } from "../world";

export interface Renderable extends Component {
  type: "renderable";
  values: void;
}
