import { Component } from "../world";

export interface Age extends Component {
  type: "age";
  values: {
    age: number;
    expireAt: number | null;
  };
}
