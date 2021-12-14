import React, {FunctionComponent, useEffect, useState} from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAveragePerDay, scaleMaxPerDay } from "../scaling";
import { TooltipLine } from "../tooltip";

export const WindBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [dataWind, setDataWind] = useState(props.data);
  const [dataGust, setDataGust] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newDataWind: dataItem[],
      newDataGust: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newDataWind = scaleAveragePerDay(props.data, 'wind');
      newDataGust = scaleMaxPerDay(props.data, 'gust');
    } else {
      setDaily(false);
      newDataWind = props.data;
      newDataGust = props.data;
    }

    setDataWind(newDataWind);
    setDataGust(newDataGust);
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
    <div data-testid="wind-diagram">
      <h3>{props.title}</h3>

      <div style={{ height: props.height }}>
        <ResponsiveLine
          data={[
            {
              id: 'wind',
              data: dataWind.map(item => ({
                x: item.timeParsed,
                y: item.wind
              }))
            },
            {
              id: 'gust',
              data: dataGust.map(item => ({
                x: item.timeParsed,
                y: item.gust
              }))
            }
          ]}
          xScale={{
            type: "time",
            useUTC: true,
            format: "%Y-%m-%dT%H:%M:%S.000Z",
            precision: 'minute'
          }}
          xFormat={daily ? "time:%Y/%m/%d" : "time:%Y/%m/%d %H:%M"}
          yScale={{
            type: "linear",
            max: Math.max.apply(Math, dataGust.map(item => item.gust)) + 5
          }}
          yFormat={value => `${value} km/h`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="cardinal"
          // @todo theme={}
          colors= {['#ffc000', '#666666']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.5}
          areaBlendMode="normal"
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: 'km/h',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 5
          }}
          axisBottom={{
            format: daily ? "%b %Y" : "%e",
            tickValues: daily ? "every month" : "every 3 days",
            tickSize: 0,
            tickPadding: 5
          }}
          isInteractive={true}
          tooltip={point => point.point.serieId === 'gust' ?
            <TooltipLine point={point.point} color="#666666" colorDarken="#333333" /> :
            <TooltipLine point={point.point} color="#ffc000" colorDarken="#7f6000" />
          }
          useMesh={true}
          enableCrosshair={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'row',
              itemWidth: 50,
              itemHeight: 20,
              itemsSpacing: 10
            }
          ]}
        />
      </div>

    </div>
  );
}