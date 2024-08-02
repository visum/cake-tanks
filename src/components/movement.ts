import { Component } from "../world";

export interface Movement extends Component {
  type: "movement";
  values: {
    speed: number;
    direction: number;
    drag?: number;
  };
}
