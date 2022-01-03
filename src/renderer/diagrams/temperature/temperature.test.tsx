import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import { TemperatureBase } from './temperature-base';
import { DewPointBase } from './dew-point-base';
import { FeltTemperatureBase } from "./felt-temperature-base";
import { TemperatureCombinedBase } from "./temperature-combined-base";
import { TemperatureMinMaxBase } from "./temperature-min-max-base";

test('temperature diagram with 11-day data', async () => {
  const { container } = render(<TemperatureBase title="Temperature" height="300px" data={data} />);

  expect(screen.getByTestId('temperature-diagram')).toHaveTextContent("Temperature");

  expect(container).toMatchSnapshot();
});

test('dew point diagram with 11-day data', async () => {
  const { container } = render(<DewPointBase title="Dew point" height="300px" data={data} />);

  expect(screen.getByTestId('dew-point-diagram')).toHaveTextContent("Dew point");

  expect(container).toMatchSnapshot();
});

test('felt temperature diagram with 11-day data', async () => {
  const { container } = render(<FeltTemperatureBase title="Felt temperature" height="300px" data={data} />);

  expect(screen.getByTestId('felt-temperature-diagram')).toHaveTextContent("Felt temperature");

  expect(container).toMatchSnapshot();
});

test('temperature combined diagram with 11-day data', async () => {
  const { container } = render(
    <TemperatureCombinedBase
      title="Temperature, Felt temperature and Dew point (Ø per day)"
      height="300px"
      data={data}
    />
  );

  expect(screen.getByTestId('temperature-combined-diagram')).toHaveTextContent("Temperature, Felt temperature and Dew point (Ø per day)");

  expect(container).toMatchSnapshot();
});

test('temperature min max diagram with 11-day data', async () => {
  const { container } = render(
    <TemperatureMinMaxBase
      title="Minimum, maximum and average temperature"
      height="300px"
      data={data}
    />
  );

  expect(screen.getByTestId('temperature-min-max-diagram')).toHaveTextContent("Minimum, maximum and average temperature");

  expect(container).toMatchSnapshot();
});