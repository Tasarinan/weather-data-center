import React, {FunctionComponent, useEffect, useState} from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAveragePerDay } from "../scaling";
import { TooltipLine} from "../tooltip";
import {Temperature32} from "@carbon/icons-react";

// @todo add font-face mono to diagrams labels / legends / axes / tooltips.
export const TemperatureBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      // @todo useMemo?
      newData = scaleAveragePerDay(props.data, 'temperature');
    } else {
      setDaily(false);
      newData = props.data;
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading
          description="Active loading indicator"
          withOverlay={false}
        />
      </div>
    );
  }

  return (
    <div data-testid="temperature-diagram">
      {props.title &&
        <h3>
          <Temperature32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }}>
        <ResponsiveLine
          data={[
            {
              id: 'temperature',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.temperature
              }))
            }
          ]}
          xScale={{
            type: "time",
            useUTC: true,
            format: "%Y-%m-%dT%H:%M:%S.000Z",
            precision: 'minute'
          }}
          // @see https://github.com/d3/d3-time-format
          xFormat={daily ? "time:%Y/%m/%d" : "time:%Y/%m/%d %H:%M"}
          yScale={{
            type: "linear",
            min: Math.min.apply(Math, data.map(item => item.temperature)) - 3,
            max: Math.max.apply(Math, data.map(item => item.temperature)) + 3
          }}
          yFormat={value => `${value} °C`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="natural"
          // @todo theme={}
          colors= {['#8B0000']}
          lineWidth={2}
          enableArea={false}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: '°C',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 10
          }}
          axisBottom={{
            format: daily ? "%b %Y" : "%e",
            tickValues: daily ? "every month" : "every 3 days",
            tickSize: 0,
            tickPadding: 5
          }}
          isInteractive={true}
          tooltip={point => <TooltipLine point={point.point} color="#8B0000" colorDarken="#450000" />}
          useMesh={true}
          enableCrosshair={true}
          markers={[
            {
              axis: 'y',
              value: 0,
              lineStyle: {
                stroke: '#00BFFF',
                strokeWidth: 2,
                strokeOpacity: 0.75,
                strokeDasharray: "10, 10"
              },
              legend: '0 °C',
              legendOrientation: 'horizontal',
            },
          ]}
        />
      </div>

    </div>
  );
}