const { __ } = require('../../constants');

module.exports = {
  defaultXOption: { label: `-- ${__('x axis')} --` },
  defaultYOption: { label: `-- ${__('y axis')} --` },

  selectBlocks: [
    {
      id: 0,
      name: 'fuelCell',
      title: __('FCS characteristics'),
      xOptions: [
        {
          id: 0,
          name: 'time',
          label: __('time'),
          units: __('s'),
          icon: 'clock',
        },
        {
          id: 1,
          name: 'fuelCellVoltage',
          label: __('voltage'),
          units: __('V'),
          icon: 'amps',
        },
      ],
      yOptions: [
        {
          id: 0,
          name: 'fuelCellVoltage',
          label: __('voltage'),
          units: __('V'),
          icon: 'volts',
        },
        {
          id: 1,
          name: 'fuelCellCurrent',
          label: __('current'),
          units: __('A'),
          icon: 'amps',
        },
        {
          id: 2,
          name: 'fuelCellTemp',
          label: __('temperature'),
          units: '\u00B0C',
          icon: 'heat',
        },
        {
          id: 3,
          name: 'fuelCellFan',
          label: __('fan power'),
          units: '%',
          icon: 'fan',
        },
        {
          id: 4,
          name: 'hydrogenConsumption',
          label: __('hydrogen consumption'),
          units: __('ml/min'),
          icon: 'hydrogen',
        },
      ],
    },
    {
      id: 1,
      name: 'battery',
      title: __('battery characteristics'),
      xOptions: [
        {
          id: 0,
          name: 'time',
          label: __('time'),
          units: __('s'),
          icon: 'clock',
        },
        {
          id: 1,
          name: 'batteryVoltage',
          label: __('voltage'),
          units: __('V'),
          icon: 'amps',
        },
      ],
      yOptions: [
        {
          id: 0,
          name: 'batteryVoltage',
          label: __('voltage'),
          units: __('V'),
          icon: 'volts',
        },
        {
          id: 1,
          name: 'batteryCurrent',
          label: __('current'),
          units: __('A'),
          icon: 'amps',
        },
      ],
    },
  ],
};
