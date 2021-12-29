import React from "react";

import { Row, Column } from "carbon-components-react";
import type { ColumnSpan } from "carbon-components-react";
import moment from "moment";

import { dataItem } from "../../diagrams/types";
import { bundleData, propertyParameter, scale } from "../../diagrams/scaling";
import { StatsItemNormal } from "./stats-item-normal";
import { StatsItemCompact } from "./stats-item-compact";

export type statsItem = {
  direction: 'min' | 'max' | 'extra',
  extra?: 'frost-days'
    | 'ice-days'
    | 'summer-days'
    | 'hot-days'
    | 'tropical-nights'
    | 'desert-days'
    | 'rain-days'
    | 'max-rain-week'
    | 'max-rain-month'
    | 'storm-days',
  property: propertyParameter,
  label: string,
  description?: string,
  unit: string,
  icon?: React.ReactElement,
  tooltip?: string,
}

interface StatsProps {
  heading?: string,
  size: 'normal' | 'compact',
  columnSpanLg: ColumnSpan,
  columnSpan: ColumnSpan,
  data: dataItem[],
  stats: statsItem[]
}

// @todo Property 'property' makes no sense for 'extra' - it's everytime property bound.
export const Stats: React.FC<StatsProps> = (props: StatsProps): React.ReactElement  => {
  const output: React.ReactElement[] = [];

  for (const statsKey of props.stats) {
    let date: string,
      value: string;

    switch (statsKey.direction) {
      case "max":
      case "min": {
        const data = props.data.slice().sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

        date = moment(data[0].timeParsed).format('YYYY/MM/DD');
        value = `${data[0][statsKey.property]} ${statsKey.unit}`;

        break;
      }
      case "extra": {
        switch (statsKey.extra) {
          case 'storm-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 62).length;

            value = data.toString();

            break;
          }
          case "max-rain-week": {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'week'
            ).sort((a, b) => b[statsKey.property] - a[statsKey.property]);

            date = moment(data[0].timeParsed).format("\\Www\\/YY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'max-rain-month': {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'month'
            ).sort((a, b) => b[statsKey.property] - a[statsKey.property]);

            date = moment(data[0].timeParsed).format("MMM YY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'rain-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).length;

            value = data.toString();
            break;
          }
          case "frost-days": {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case "ice-days": {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case 'summer-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 25).length;

            value = data.toString();
            break;
          }
          case 'hot-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 30).length;

            value = data.toString();
            break;
          }
          case 'tropical-nights': {
            const dataBundledPerDay = bundleData(props.data.filter(item => parseInt(moment.unix(item.time).utc().format('HH')) >= 18 || parseInt(moment.unix(item.time).utc().format('HH')) < 6), statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) >= 20).length;

            value = data.toString();
            break;
          }
          case 'desert-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 35).length;

            value = data.toString();
            break;
          }
        }
      }
    }

    switch (props.size) {
      case "compact": {
        output.push(
          <StatsItemCompact
            key={`${statsKey.property}${statsKey.direction}${statsKey.extra}`}
            columnSpanLg={props.columnSpanLg}
            columnSpan={props.columnSpan}
            item={statsKey}
            date={date ? date : false}
            value={value}
            tooltip={statsKey.tooltip}
          />
        );
        break;
      }
      default: {
        output.push(
          <StatsItemNormal
            key={`${statsKey.property}${statsKey.direction}${statsKey.extra}`}
            columnSpanLg={props.columnSpanLg}
            columnSpan={props.columnSpan}
            item={statsKey}
            date={date}
            value={value}
          />
        );
      }
    }
  }

  return (
    <Row className={`stats ${props.size}`}>
      {props.heading &&
        <Column sm={12} lg={12} max={12}>
          <h3 className="heading">
            {props.heading}
          </h3>
        </Column>
      }
      {output}
    </Row>
  );
};