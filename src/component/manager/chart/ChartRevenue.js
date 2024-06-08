import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { LinkAPI } from "../../../LinkAPI";

class ChartRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("authToken");

    fetch(`${LinkAPI}orders/doanhthuthang`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const monthsData = this.populateMissingMonths(data);
        this.setState({ orders: monthsData });
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }

  populateMissingMonths(data) {
    const monthsData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const matchingData = data.find((item) => item.thang === month);
      return matchingData || { thang: month, tongDoanhThu: 0 };
    });
    return monthsData;
  }

  render() {
    return (
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={this.state.orders}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="thang" fontSize={12} tick={{ fill: "white" }}>
              <Label
                offset={0}
                position="insideBottom"
                style={{
                  textAnchor: "middle",
                  fill: "white",
                  marginTop: "20px",
                }}
              />
            </XAxis>
            <YAxis fontSize={12} tick={{ fill: "white" }} />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              formatter={(value, name, props) => [
                `${value} 000đ`,
                `Tổng Danh Thu`,
              ]}
            />
            <Bar dataKey="tongDoanhThu" fill="#1a1776" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ChartRevenue;
