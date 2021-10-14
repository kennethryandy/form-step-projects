import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function WalletBodyRight() {
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    setChartData({
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Sales",
          data: [5, 10, 7, 28, 7, 40],
          backgroundColor: ["#4BA4FF1F"],
          borderColor: ["#4BA4FF"],
          borderWidth: 4,
          pointBackgroundColor: "#4BA4FF",
          pointBorderColor: "#4BA4FF",
        },
      ],
    });
  }, []);
  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            xAxes: [
              {
                ticks: {
                  autoSkip: true,
                },
                gridLines: false,
              },
            ],
          },
        }}
      />
    </div>
  );
}

export default WalletBodyRight;
