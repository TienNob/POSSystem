import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { LinkAPI } from "../../../LinkAPI";

class ChartProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drinks: [],
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("authToken");
    fetch(`${LinkAPI}orders/thucuongyeuthich`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const top3Drinks = data
          .sort((a, b) => b.soLuong - a.soLuong)
          .slice(0, 3);
        this.setState({ drinks: top3Drinks });
      })
      .catch((error) => console.error("Error fetching drinks:", error));
  }

  render() {
    const DARK_COLORS = [
      "#d62728",
      "#9467bd",
      "#e377c2",
      "#8c564b",
      "#ff7f0e",
      "#2ca02c",
      "#7f7f7f",
      "#1f77b4",
      "#bcbd22",
      "#17becf",
    ];
    return (
      <div style={{ width: "80%", height: 400, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            textAlign: "center",
            width: "100%",
            marginTop: "10px",
          }}
        ></div>
        <ResponsiveContainer className="chart-product">
          <PieChart>
            <Pie
              data={this.state.drinks}
              dataKey="soLuong"
              nameKey="tenNuoc"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#333"
              label
            >
              {this.state.drinks.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DARK_COLORS[index % DARK_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ChartProduct;
