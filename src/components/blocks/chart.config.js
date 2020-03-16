module.exports = function config(points, axesLabels) {
  return {
    type: "line",
    data: {
      datasets: [
        {
          data: points,
          backgroundColor: "rgba(26,162,221, .1)",
          borderColor: "#1aa2dd"
        }
      ]
    },
    options: {
      responsive: false,
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: 0 // disables bezier curves
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            type: "linear",
            scaleLabel: {
              display: true,
              labelString: axesLabels.x,
              fontFamily: "'Montserrat', 'Helvetice Neue', 'Helvetica', 'Aria', sans-serif",
              fontSize: 12,
            },
            ticks: {
              maxTickLimit: 8
            }
          }
        ],
        yAxes: [
          {
            display: true,
            type: "linear",
            scaleLabel: {
              display: true,
              fontFamily: "'Montserrat', 'Helvetice Neue', 'Helvetica', 'Aria', sans-serif",
              labelString: axesLabels.y,
              fontSize: 12,
            },
            ticks: {
              maxTickLimit: 8
            }
          }
        ]
      },
      animation: {
        duration: 0 // general animation time
      },
      hover: {
        animationDuration: 0 // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x"
          },
          zoom: {
            enabled: true,
            mode: "x"
          }
        }
      }
    }
  }
}