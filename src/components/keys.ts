import { Component } from "../world";

export interface Keys extends Component {
  type: "keys";
  values: string[];
}
