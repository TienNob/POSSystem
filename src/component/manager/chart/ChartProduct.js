import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

class ChartProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drinks: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/orders/thucuongyeuthich")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drinks: data });
      })
      .catch((error) => console.error("Error fetching drinks:", error));
  }

  render() {
    const DARK_COLORS = [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
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
        >
          {/* <span style={{ fontSize: '16px' }}>Biểu đồ tròn thức uống yêu thích</span> */}
        </div>
        <ResponsiveContainer>
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
