import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import {Stats} from "../components/stats/stats";
import {TemperatureLow} from "@carbon/pictograms-react";
import {TemperatureBase} from "../diagrams/temperature/temperature-base";
import {SolarBase} from "../diagrams/solar/solar-base";
import {UviBase} from "../diagrams/uvi/uvi-base";

export const SolarPage: React.FC = (): React.ReactElement => {
  const dataFilteredFromStore = useSelector((state: RootState) => state.appState.dataFilteredPerTime);
  const loading = useSelector((state: RootState) => state.appState.loading);

  const [data, setData] = useState(dataFilteredFromStore);

  useEffect(() => {
    setData(dataFilteredFromStore);
  }, [dataFilteredFromStore]);

  if (loading) {
    return null;
  }

  if (data.length > 0) {
    return (
      <div className="page">
        <Row>
          <Column>
            <h1>Solar & UVI</h1>

            <Row className="tiles">
              <Column sm={12} lg={12} max={12}>
                <Tile className="combined-tile-stats-diagram">
                  <Row>
                    <Column sm={12} lg={12} max={12}>
                      <h3>Minimum/Maximum values</h3>
                    </Column>
                  </Row>
                  <Row>
                    <Column sm={12} lg={12} max={3}>
                      <Stats
                        data={data}
                        columnSpanLg={3}
                        columnSpan={6}
                        size="compact"
                        stats={[
                          {
                            property: 'solar',
                            direction: 'max',
                            label: 'Max Solar radiation',
                            unit: 'w/m²'
                          },
                          {
                            property: 'uvi',
                            direction: 'max',
                            label: 'Max UV Index',
                            unit: 'UVI'
                          }
                        ]}
                      />
                    </Column>
                    <Column sm={12} lg={12} max={9}>
                      {/* @todo Add annotations. */}
                      <SolarBase height="600px" data={data} />
                    </Column>
                  </Row>
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12}>
                <Tile id="solar-01-uvi">
                  <UviBase height="600px" data={data} title="UV Index (Max per day)" />
                </Tile>
              </Column>
            </Row>
          </Column>
        </Row>
      </div>
    );
  }

  return (
    <Empty />
  );
}